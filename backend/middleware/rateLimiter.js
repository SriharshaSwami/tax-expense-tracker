import rateLimit from 'express-rate-limit'

// Generic API Rate Limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 150, // Limit each IP to 150 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP addresses, please try again in 15 minutes.'
  },
  standardHeaders: true, // Return standard rate limit info headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
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
