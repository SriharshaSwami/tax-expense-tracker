import User from '../models/User.js'
import { OAuth2Client } from 'google-auth-library'
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
import { getPasswordResetEmailTemplate } from '../utils/emailTemplates.js'

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  profilePicture: user.profilePicture,
  authProvider: user.authProvider,
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

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body

  if (!credential) {
    throw new AppError('Google credential token is missing', 400)
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()
  const { sub: googleId, email, name, picture } = payload

  let user = await User.findOne({ email: email.toLowerCase().trim() })

  if (user) {
    let updated = false
    if (!user.googleId) {
      user.googleId = googleId
      user.authProvider = 'google'
      updated = true
    }
    if (!user.profilePicture && picture) {
      user.profilePicture = picture
      user.avatar = picture // maintain backwards compatibility
      updated = true
    }
    if (updated) await user.save({ validateBeforeSave: false })
  } else {
    user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      googleId,
      profilePicture: picture,
      avatar: picture,
      authProvider: 'google',
      salary: 0,
      taxRegime: 'new'
    })
  }

  const token = generateToken(user._id)
  sendTokenCookie(res, token)

  return ApiResponse.success(res, { user: formatUser(user), token }, 'Google Login successful')
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
  if (!user) {
    // Anti-enumeration: return success even if user not found
    return ApiResponse.success(res, null, 'If that email is registered, a reset link has been sent.')
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

  const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`
  const htmlContent = getPasswordResetEmailTemplate(resetUrl, user.name || 'there')

  try {
    await sendMail({
      to: user.email,
      subject: 'TaxExpense Planner - Password Reset Request',
      text: message,
      html: htmlContent,
    })

    return ApiResponse.success(res, null, 'Password reset email sent')
  } catch (err) {
    console.error('Nodemailer Error:', err.message)
    console.error('SMTP Error Code:', err.code)
    console.error('SMTP Response:', err.response)
    console.error('Full Error:', err)
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    throw new AppError('There was an error sending the email. Try again later.', 500)
  }
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params
  const { password } = req.body
  
  if (!token || !password) throw new AppError('Missing required fields', 400)
  
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400)
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
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
