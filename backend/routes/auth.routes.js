import express from 'express'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/me', getCurrentUser)

export default router
