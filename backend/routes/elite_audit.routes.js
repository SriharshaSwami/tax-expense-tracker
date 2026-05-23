import express from 'express'
import multer from 'multer'
import { body, validationResult } from 'express-validator'
import { uploadAndParseReceipt, previewTaxRegimes } from '../controllers/eliteAudit.controller.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB

// POST /api/elite-audit/ocr
router.post('/ocr', upload.single('file'), uploadAndParseReceipt)

// POST /api/elite-audit/tax-preview
const taxValidators = [
	body('annualSalary').optional().isNumeric().withMessage('annualSalary must be numeric'),
	body('otherIncome').optional().isNumeric().withMessage('otherIncome must be numeric'),
]

router.post('/tax-preview', taxValidators, (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ success: false, errors: errors.array() })
	}
	return previewTaxRegimes(req, res, next)
})

export default router
