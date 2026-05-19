import ErrorResponse from '../utils/errorResponse.js'

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error Handler Triggered:', err)
  }

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`
    error = new ErrorResponse(message, 404)
  }

  // 2. Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'Field'
    const message = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists / registered`
    error = new ErrorResponse(message, 409)
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ')
    error = new ErrorResponse(message, 400)
  }

  // 4. JWT Expiration & Invalid Signature
  if (err.name === 'JsonWebTokenError') {
    const message = 'Authentication token signature is invalid. Please log in again.'
    error = new ErrorResponse(message, 401)
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Authentication session has expired. Please authenticate again.'
    error = new ErrorResponse(message, 401)
  }

  // 5. Multer File Limit Error
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Receipt image size exceeds the maximum allowed limit of 2MB.'
    error = new ErrorResponse(message, 400)
  }

  // Final Response Construction
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server encountered an unexpected error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

export default errorHandler
