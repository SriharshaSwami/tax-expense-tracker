import rateLimit from 'express-rate-limit'

// Generic API Rate Limiter - Increased for active users
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 500, // Limit each IP to 500 requests per window (was 150)
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Don't rate limit health check
    if (req.method === 'GET' && req.path === '/') return true
    return false
  }
})

// Notification polling specific limiter - Very lenient
export const notificationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 Minute
  max: 60, // 60 requests per minute (allows 1 request per second for polling)
  message: {
    success: false,
    message: 'Notification polling rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Hardened Authentications / Registration Limiter
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Hour
  max: 20, // Limit each IP to 20 auth attempts per hour
  message: {
    success: false,
    message: 'Too many authentication attempts from this device, please try again in an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Mutation limiter (POST/PUT/DELETE non-auth)
export const mutationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 30,
  message: { success: false, message: 'Slow down, too many writes.' },
})
