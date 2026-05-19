import Notification from '../models/Notification.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Get user Notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50) // Return last 50 alerts to keep it high performance

  res.status(200).json({
    success: true,
    count: notifications.length,
    notifications,
  })
})

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params

  const notification = await Notification.findById(id)
  if (!notification) {
    throw new AppError('Notification alert not found', 404)
  }

  // Validate ownership
  if (notification.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to modify this notification', 403)
  }

  notification.read = true
  await notification.save()

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    notification,
  })
})

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { $set: { read: true } }
  )

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read successfully',
  })
})

// @desc    Delete a specific notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params

  const notification = await Notification.findById(id)
  if (!notification) {
    throw new AppError('Notification alert not found', 404)
  }

  // Validate ownership
  if (notification.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to delete this notification', 403)
  }

  await notification.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  })
})
