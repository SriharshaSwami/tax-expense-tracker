import SavingsGoal from '../models/SavingsGoal.js'
import Notification from '../models/Notification.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Create a new Savings Goal
// @route   POST /api/goals
// @access  Private
export const addGoal = asyncHandler(async (req, res) => {
  const { title, targetAmount, currentAmount, deadline } = req.body

  if (!title || !targetAmount || !deadline) {
    throw new AppError('Please provide title, target amount, and deadline date', 400)
  }

  const parsedTarget = Number(targetAmount)
  if (isNaN(parsedTarget) || parsedTarget <= 0) {
    throw new AppError('Target amount must be a positive number greater than zero', 400)
  }

  const parsedCurrent = currentAmount !== undefined ? Number(currentAmount) : 0
  if (isNaN(parsedCurrent) || parsedCurrent < 0) {
    throw new AppError('Current saved contribution cannot be a negative amount', 400)
  }

  const deadlineDate = new Date(deadline)
  if (isNaN(deadlineDate.getTime())) {
    throw new AppError('Please provide a valid deadline calendar date', 400)
  }

  if (deadlineDate < new Date()) {
    throw new AppError('Goal deadline date cannot be set in the past', 400)
  }

  const status = parsedCurrent >= parsedTarget ? 'completed' : 'active'

  const goal = await SavingsGoal.create({
    user: req.user._id,
    title,
    targetAmount: parsedTarget,
    currentAmount: parsedCurrent,
    deadline: deadlineDate,
    status,
  })

  // If completed right out of the gate, send a notification
  if (status === 'completed') {
    await Notification.create({
      user: req.user._id,
      type: 'goal_achievement',
      title: `Savings Goal Completed! 🏆`,
      message: `Congratulations! You've achieved your goal of ₹${parsedTarget.toLocaleString('en-IN')} for "${title}"!`,
      meta: {
        goalId: goal._id.toString(),
        type: 'achievement',
      },
    })
  }

  res.status(201).json({
    success: true,
    message: 'Savings goal created successfully',
    goal,
  })
})

// @desc    Get user Savings Goals
// @route   GET /api/goals
// @access  Private
export const getGoals = asyncHandler(async (req, res) => {
  const goals = await SavingsGoal.find({ user: req.user._id }).sort({ deadline: 1, createdAt: -1 })

  res.status(200).json({
    success: true,
    count: goals.length,
    goals,
  })
})

// @desc    Update savings goal contribution or info
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, targetAmount, currentAmount, deadline } = req.body

  const goal = await SavingsGoal.findById(id)
  if (!goal) {
    throw new AppError('Savings goal not found', 404)
  }

  // Validate ownership
  if (goal.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to modify this savings goal', 403)
  }

  if (targetAmount !== undefined) {
    const parsedTarget = Number(targetAmount)
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      throw new AppError('Target amount must be a positive number greater than zero', 400)
    }
    goal.targetAmount = parsedTarget
  }

  if (currentAmount !== undefined) {
    const parsedCurrent = Number(currentAmount)
    if (isNaN(parsedCurrent) || parsedCurrent < 0) {
      throw new AppError('Current contribution cannot be negative', 400)
    }
    goal.currentAmount = parsedCurrent
  }

  if (title !== undefined) goal.title = title

  if (deadline !== undefined) {
    const deadlineDate = new Date(deadline)
    if (isNaN(deadlineDate.getTime())) {
      throw new AppError('Please provide a valid deadline calendar date', 400)
    }
    goal.deadline = deadlineDate
  }

  // Determine status transition
  const oldStatus = goal.status
  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = 'completed'
  } else {
    goal.status = 'active'
  }

  await goal.save()

  // 1. Check completed status transition
  if (goal.status === 'completed' && oldStatus !== 'completed') {
    await Notification.create({
      user: req.user._id,
      type: 'goal_achievement',
      title: `Savings Goal Completed! 🏆`,
      message: `Congratulations! You've achieved your goal of ₹${goal.targetAmount.toLocaleString('en-IN')} for "${goal.title}"!`,
      meta: {
        goalId: goal._id.toString(),
        type: 'achievement',
      },
    })
  }

  // 2. Check 50% milestone alert
  const progressPercent = (goal.currentAmount / goal.targetAmount) * 100
  if (progressPercent >= 50 && progressPercent < 100) {
    const milestoneSent = await Notification.findOne({
      user: req.user._id,
      type: 'savings_milestone',
      'meta.goalId': goal._id.toString(),
      'meta.type': 'milestone_50',
    })

    if (!milestoneSent) {
      await Notification.create({
        user: req.user._id,
        type: 'savings_milestone',
        title: `Savings Milestone: 50% Reached! 🌟`,
        message: `Great job! You have saved half of your target contribution of ₹${goal.targetAmount.toLocaleString('en-IN')} for "${goal.title}"!`,
        meta: {
          goalId: goal._id.toString(),
          type: 'milestone_50',
          progressPercent,
        },
      })
    }
  }

  res.status(200).json({
    success: true,
    message: 'Savings goal updated successfully',
    goal,
  })
})

// @desc    Delete a Savings Goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = asyncHandler(async (req, res) => {
  const { id } = req.params

  const goal = await SavingsGoal.findById(id)
  if (!goal) {
    throw new AppError('Savings goal not found', 404)
  }

  // Validate ownership
  if (goal.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to delete this savings goal', 403)
  }

  await goal.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Savings goal deleted successfully',
  })
})
