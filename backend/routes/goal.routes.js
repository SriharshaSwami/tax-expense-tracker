import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import {
  addGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from '../controllers/goal.controller.js'

const router = express.Router()

router.use(protectRoute)

router.route('/')
  .post(addGoal)
  .get(getGoals)

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal)

export default router
