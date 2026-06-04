import express from 'express'
import { askAssistant, getDashboardInsights } from '../controllers/ai.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/', protectRoute, askAssistant)
router.get('/insights', protectRoute, getDashboardInsights)

export default router
