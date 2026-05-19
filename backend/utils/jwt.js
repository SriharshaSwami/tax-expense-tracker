import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const sendTokenCookie = (res, token) => {
  res.cookie('token', token, cookieOptions)
}

export const clearTokenCookie = (res) => {
  res.clearCookie('token', cookieOptions)
}
