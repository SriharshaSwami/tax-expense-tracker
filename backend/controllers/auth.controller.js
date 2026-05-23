import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import {
  clearTokenCookie,
  generateToken,
  sendTokenCookie,
} from '../utils/jwt.js'
import ApiResponse from '../utils/ApiResponse.js'
import crypto from 'crypto'
import { sendMail } from '../utils/mailer.js'

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

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
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

  return ApiResponse.created(res, { user: formatUser(user) }, 'Registration successful')
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400)
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    '+password'
  )

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401)
  }

  const token = generateToken(user._id)
  sendTokenCookie(res, token)

  return ApiResponse.success(res, { user: formatUser(user) }, 'Login successful')
})

export const logoutUser = asyncHandler(async (req, res) => {
  clearTokenCookie(res)

  return ApiResponse.success(res, null, 'Logged out successfully')
})

export const getCurrentUser = asyncHandler(async (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return ApiResponse.success(res, { user: null })
  }

  try {
    const decoded = verifyToken(token)
    const user = await User.findById(decoded.userId)
    if (!user) {
      return ApiResponse.success(res, { user: null })
    }
    return ApiResponse.success(res, { user: formatUser(user) })
  } catch {
    return ApiResponse.success(res, { user: null })
  }
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) throw new AppError('Please provide an email', 400)

  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user) throw new AppError('No user found with that email', 404)

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&id=${user._id}`

  const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`

  try {
    await sendMail({
      to: user.email,
      subject: 'Password reset request',
      text: message,
      html: `<p>${message}</p><p>If you did not request this, please ignore.</p>`,
    })

    return ApiResponse.success(res, null, 'Password reset email sent')
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    throw new AppError('There was an error sending the email. Try again later.', 500)
  }
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, id, password } = req.body
  if (!token || !id || !password) throw new AppError('Missing required fields', 400)

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    _id: id,
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  if (!user) throw new AppError('Invalid or expired token', 400)

  user.password = password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  const jwtToken = generateToken(user._id)
  sendTokenCookie(res, jwtToken)

  return ApiResponse.success(res, { user: formatUser(user) }, 'Password reset successful')
})
