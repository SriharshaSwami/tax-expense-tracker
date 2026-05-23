import multer from 'multer'
import ApiResponse from '../utils/ApiResponse.js'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
])

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error('File type not allowed. Use JPEG, PNG, WEBP, or PDF.'), false)
  }
  cb(null, true)
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
})

// Error handler wrapper
export const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return ApiResponse.error(res, 'File too large. Maximum 2 MB.', 400)
      }
      return ApiResponse.error(res, err.message, 400)
    }
    if (err) return ApiResponse.error(res, err.message, 400)
    next()
  })
}

export default upload
