import Budget from '../models/Budget.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { recalculateBudget } from '../utils/budgetTracker.js'

// @desc    Create a new Category Budget
// @route   POST /api/budgets
// @access  Private
export const addBudget = asyncHandler(async (req, res) => {
  const { category, monthlyLimit, month, year, alertThreshold } = req.body

  if (!category || !monthlyLimit || !month || !year) {
    throw new AppError('Please provide category, monthly limit, month, and year', 400)
  }

  const parsedLimit = Number(monthlyLimit)
  if (isNaN(parsedLimit) || parsedLimit <= 0) {
    throw new AppError('Monthly limit must be a valid positive number', 400)
  }

  const parsedMonth = parseInt(month)
  const parsedYear = parseInt(year)

  if (parsedMonth < 1 || parsedMonth > 12) {
    throw new AppError('Month must be between 1 and 12', 400)
  }

  try {
    const budget = await Budget.create({
      user: req.user._id,
      category,
      monthlyLimit: parsedLimit,
      month: parsedMonth,
      year: parsedYear,
      alertThreshold: alertThreshold ? Number(alertThreshold) : 80,
    })

    // Perform initial spentAmount calculation based on pre-existing transactions
    await recalculateBudget(req.user._id, category, parsedMonth, parsedYear)

    // Reload the updated budget to return
    const updatedBudget = await Budget.findById(budget._id)

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      budget: updatedBudget,
    })
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError(`A budget has already been defined for "${category}" in ${parsedMonth}/${parsedYear}`, 400)
    }
    throw err
  }
})

// @desc    Get user Budgets
// @route   GET /api/budgets
// @access  Private
export const getBudgets = asyncHandler(async (req, res) => {
  const { month, year } = req.query
  const query = { user: req.user._id }

  if (month) query.month = parseInt(month)
  if (year) query.year = parseInt(year)

  const budgets = await Budget.find(query).sort({ year: -1, month: -1, category: 1 })

  res.status(200).json({
    success: true,
    count: budgets.length,
    budgets,
  })
})

// @desc    Update budget parameters
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { monthlyLimit, alertThreshold } = req.body

  const budget = await Budget.findById(id)
  if (!budget) {
    throw new AppError('Budget config not found', 404)
  }

  // Validate ownership
  if (budget.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to modify this budget configuration', 403)
  }

  if (monthlyLimit !== undefined) {
    const parsedLimit = Number(monthlyLimit)
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      throw new AppError('Monthly limit must be a valid positive number', 400)
    }
    budget.monthlyLimit = parsedLimit
  }

  if (alertThreshold !== undefined) {
    const parsedThreshold = Number(alertThreshold)
    if (isNaN(parsedThreshold) || parsedThreshold < 1 || parsedThreshold > 100) {
      throw new AppError('Alert threshold must be a percentage between 1 and 100', 400)
    }
    budget.alertThreshold = parsedThreshold
  }

  await budget.save()

  // Recalculate based on updated parameters
  await recalculateBudget(req.user._id, budget.category, budget.month, budget.year)

  const updatedBudget = await Budget.findById(id)

  res.status(200).json({
    success: true,
    message: 'Budget updated successfully',
    budget: updatedBudget,
  })
})

// @desc    Delete a Budget config
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = asyncHandler(async (req, res) => {
  const { id } = req.params

  const budget = await Budget.findById(id)
  if (!budget) {
    throw new AppError('Budget config not found', 404)
  }

  // Validate ownership
  if (budget.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to delete this budget configuration', 403)
  }

  await budget.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Budget deleted successfully',
  })
})
