import asyncHandler from '../middleware/asyncHandler.js'
import { extractReceiptText, parseReceiptData } from '../utils/ocrEngine.js'
import { compareTaxRegimes } from '../utils/taxEngine.js'

export const uploadAndParseReceipt = asyncHandler(async (req, res) => {
  // Accept either a remote URL (fileUrl), a base64 body, or an uploaded multipart file (req.file)
  const { fileUrl, fileType } = req.body || {}
  let fileSource = null

  if (req.file && req.file.buffer) {
    // Prefer in-memory buffer from multer
    fileSource = req.file.buffer
  } else if (fileUrl) {
    fileSource = fileUrl
  } else if (req.body && req.body.base64) {
    fileSource = req.body.base64
  }

  if (!fileSource) {
    return res.status(400).json({ success: false, message: 'No file provided. Provide fileUrl or multipart file.' })
  }

  const rawText = await extractReceiptText(fileSource, fileType)
  const parsed = await parseReceiptData(rawText)

  return res.status(200).json({ success: true, data: parsed })
})

export const previewTaxRegimes = asyncHandler(async (req, res) => {
  const inputs = req.body || {}
  // Inputs should include annualSalary, otherIncome, deductions80C, deductions80D, homeLoanInterest, hraExemption, professionalTax
  const result = compareTaxRegimes(inputs)

  return res.status(200).json({ success: true, data: result })
})
