import { validationResult } from 'express-validator'
import ApiResponse from '../utils/ApiResponse.js'

/**
 * Runs after validation chains. Returns 400 if any rule fails.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const details = errors.array().map(({ path, msg }) => ({ field: path, message: msg }))
    return ApiResponse.error(res, 'Validation failed', 400, details)
  }
  next()
}
