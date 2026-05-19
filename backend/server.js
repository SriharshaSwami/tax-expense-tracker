import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import xss from 'xss-clean'
import hpp from 'hpp'
import morgan from 'morgan'
import sanitize from 'mongo-sanitize'
import connectDB from './config/db.js'

// Route Imports
import testRoutes from './routes/test.routes.js'
import authRoutes from './routes/auth.routes.js'
import transactionRoutes from './routes/transaction.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import taxRoutes from './routes/tax.routes.js'
import insightsRoutes from './routes/insights.routes.js'
import budgetRoutes from './routes/budget.routes.js'
import goalRoutes from './routes/goal.routes.js'
import notificationRoutes from './routes/notification.routes.js'

// Custom Middleware Imports
import errorHandler from './middleware/error.middleware.js'
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js'

// Load System Variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Initialize MongoDB Atlas connection
connectDB()

// 1. HTTP Request Logging using Morgan
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

// 2. Helmet Secure Headers Protection
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP to prevent Recharts/Fonts rendering conflicts
}))

// 3. Dynamic CORS Production setup
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Cross-Origin Request blocked by CORS Hardening!'))
      }
    },
    credentials: true,
  })
)

// 4. Body & Parameter Parsers
app.use(express.json({ limit: '10kb' })) // Block excessive payload sizes
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// 5. NoSQL Injection Prevention Middleware
app.use((req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body)
  }
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      req.query[key] = sanitize(req.query[key])
    })
  }
  if (req.params) {
    Object.keys(req.params).forEach((key) => {
      req.params[key] = sanitize(req.params[key])
    })
  }
  next()
})

// 6. XSS Script Purging & Parameter Pollution Protection
app.use(xss())
app.use(hpp())

// 7. Request Rate Limiting
app.use('/api', apiLimiter)
app.use('/api/auth', authLimiter)

// Endpoint Mounts
app.use('/api', testRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/tax', taxRoutes)
app.use('/api/insights', insightsRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/notifications', notificationRoutes)

// API Landing health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TaxExpense Planner Production API',
    version: '1.0.0',
    status: 'Healthy',
  })
})

// Global Error Catching boundary
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Production Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})
