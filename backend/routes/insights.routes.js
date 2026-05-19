import express from 'express'
import {
  getFinancialHealth,
  getSpendingPatterns,
  getRecommendations,
} from '../controllers/insights.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

// Secure all endpoints in this router
router.use(protectRoute)

// GET /api/insights/financial-health
router.get('/financial-health', getFinancialHealth)

// GET /api/insights/spending-patterns
router.get('/spending-patterns', getSpendingPatterns)

// GET /api/insights/recommendations
router.get('/recommendations', getRecommendations)

export default router
