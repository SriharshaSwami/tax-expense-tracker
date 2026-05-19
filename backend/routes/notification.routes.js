import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller.js'

const router = express.Router()

router.use(protectRoute)

router.route('/')
  .get(getNotifications)

router.route('/read-all')
  .put(markAllAsRead)

router.route('/:id/read')
  .put(markAsRead)

router.route('/:id')
  .delete(deleteNotification)

export default router
