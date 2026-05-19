import express from 'express'
import {
  calculateTax,
  saveTaxCalculation,
  getTaxHistory,
} from '../controllers/tax.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

// Secure all tax calculator endpoints
router.use(protectRoute)

router.post('/calculate', calculateTax)
router.post('/save', saveTaxCalculation)
router.get('/history', getTaxHistory)

export default router
