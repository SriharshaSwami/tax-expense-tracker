import express from 'express'
import rateLimit from 'express-rate-limit'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  resetPassword,
  googleAuth,
} from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { createTransporter } from '../utils/mailer.js'

const router = express.Router()

// Rate limiter for password reset routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP. Please try again after 15 minutes.',
    })
  },
})

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/google', googleAuth)
router.post('/logout', logoutUser)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password/:token', authLimiter, resetPassword)
router.get('/me', getCurrentUser)

// ⚠️ TEMPORARY — delete after confirming SMTP works on Render
router.get('/test-smtp', async (req, res) => {
  try {
    const transporter = createTransporter()
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) reject(error)
        else resolve(success)
      })
    })
    res.json({ status: 'ok', message: 'SMTP connection successful' })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'SMTP connection failed',
      error: {
        code: error.code,
        command: error.command,
        response: error.response,
        message: error.message,
      },
    })
  }
})

export default router
