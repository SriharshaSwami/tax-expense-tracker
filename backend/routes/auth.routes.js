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
import { sendMail } from '../utils/mailer.js'

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

// ⚠️ TEMPORARY — delete after confirming Brevo works on Render
router.get('/test-email', async (req, res) => {
  try {
    await sendMail({
      to: process.env.EMAIL_FROM,
      subject: 'Brevo Test — Taxsathi',
      html: '<p>If you see this, Brevo API email is working on Render.</p>',
    })
    res.json({ status: 'ok', message: 'Test email sent via Brevo API' })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Brevo email failed',
      error: {
        statusCode: error.statusCode || error.status,
        body: error.body || error.response?.body,
        message: error.message,
      },
    })
  }
})

export default router
