import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from '../controllers/budget.controller.js'

const router = express.Router()

router.use(protectRoute)

router.route('/')
  .post(addBudget)
  .get(getBudgets)

router.route('/:id')
  .put(updateBudget)
  .delete(deleteBudget)

export default router
