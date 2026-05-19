import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import {
  clearTokenCookie,
  generateToken,
  sendTokenCookie,
} from '../utils/jwt.js'

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  salary: user.salary,
  taxRegime: user.taxRegime,
  createdAt: user.createdAt,
})

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, salary, taxRegime, avatar } = req.body

  if (!name || !email || !password) {
    throw new AppError('Please provide name, email, and password', 400)
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400)
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw new AppError('Email already registered', 409)
  }

  const user = await User.create({
    name,
    email,
    password,
    salary,
    taxRegime,
    avatar,
  })

  const token = generateToken(user._id)
  sendTokenCookie(res, token)

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: formatUser(user),
  })
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400)
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password'
  )

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401)
  }

  const token = generateToken(user._id)
  sendTokenCookie(res, token)

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: formatUser(user),
  })
})

export const logoutUser = asyncHandler(async (req, res) => {
  clearTokenCookie(res)

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
})

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: formatUser(req.user),
  })
})
