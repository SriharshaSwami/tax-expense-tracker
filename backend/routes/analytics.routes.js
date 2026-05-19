import express from 'express'
import {
  getMonthlyAnalytics,
  getCategoryBreakdown,
  getRecentTrends,
} from '../controllers/analytics.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

// Secure all analytical endpoints
router.use(protectRoute)

router.get('/monthly', getMonthlyAnalytics)
router.get('/category-breakdown', getCategoryBreakdown)
router.get('/recent-trends', getRecentTrends)

export default router
