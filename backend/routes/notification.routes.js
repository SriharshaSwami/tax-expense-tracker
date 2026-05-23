import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { notificationLimiter } from '../middleware/rateLimiter.js'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller.js'

const router = express.Router()

router.use(protectRoute)

// Apply higher rate limit for notification polling
router.route('/')
  .get(notificationLimiter, getNotifications)

router.route('/read-all')
  .put(markAllAsRead)

router.route('/:id/read')
  .put(markAsRead)

router.route('/:id')
  .delete(deleteNotification)

export default router
