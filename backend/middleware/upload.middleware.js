import multer from 'multer'
import path from 'path'

// Configure memory storage (ideal for streaming direct buffers to Cloudinary)
const storage = multer.memoryStorage()

// Validate file extensions and MIME types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
  const fileExt = path.extname(file.originalname).toLowerCase()

  if (allowedExtensions.includes(fileExt)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        'Invalid file type. Only image files (JPG, JPEG, PNG, WEBP) and PDFs are allowed.'
      ),
      false
    )
  }
}

// Instantiate Multer with limits and filter configurations
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
})

export default upload
