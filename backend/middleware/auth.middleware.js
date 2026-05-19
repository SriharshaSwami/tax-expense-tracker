import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { verifyToken } from '../utils/jwt.js'

export const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    throw new AppError('Not authorized. Please log in.', 401)
  }

  let decoded
  try {
    decoded = verifyToken(token)
  } catch {
    throw new AppError('Invalid or expired token. Please log in again.', 401)
  }

  const user = await User.findById(decoded.userId)

  if (!user) {
    throw new AppError('User no longer exists.', 401)
  }

  req.user = user
  next()
})
