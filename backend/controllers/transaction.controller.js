import path from 'path'
import Transaction from '../models/Transaction.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import cloudinary from '../config/cloudinary.js'
import { extractReceiptText, parseReceiptData } from '../utils/ocrEngine.js'
import { recalculateBudget, checkSpendingSpike } from '../utils/budgetTracker.js'

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
export const addTransaction = asyncHandler(async (req, res) => {
  const { title, amount, type, category, date, note } = req.body

  if (!title || !amount || !type || !category) {
    throw new AppError('Please provide title, amount, type, and category', 400)
  }

  const parsedAmount = Number(amount)
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new AppError('Amount must be a valid number greater than zero', 400)
  }

  const transaction = await Transaction.create({
    user: req.user._id,
    title,
    amount: parsedAmount,
    type,
    category,
    date: date || new Date(),
    note: note || '',
  })

  if (type === 'expense') {
    const txDate = new Date(transaction.date)
    await checkSpendingSpike(req.user._id, parsedAmount, title, category)
    await recalculateBudget(req.user._id, category, txDate.getMonth() + 1, txDate.getFullYear())
  }

  res.status(201).json({
    success: true,
    message: 'Transaction added successfully',
    transaction,
  })
})

// @desc    Get all transactions of the user with advanced filtering
// @route   GET /api/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req, res) => {
  const { type, category, month, year, search } = req.query

  const query = { user: req.user._id }

  // Filter by Type (income/expense)
  if (type && ['income', 'expense'].includes(type)) {
    query.type = type
  }

  // Filter by Category
  if (category) {
    query.category = category
  }

  // Live text search on Title
  if (search) {
    query.title = { $regex: search, $options: 'i' }
  }

  // Filter by Month and Year
  if (year) {
    const yr = parseInt(year)
    if (month) {
      const mth = parseInt(month)
      const startDate = new Date(Date.UTC(yr, mth - 1, 1))
      const endDate = new Date(Date.UTC(yr, mth, 0, 23, 59, 59, 999)) // Last day of mth
      query.date = { $gte: startDate, $lte: endDate }
    } else {
      const startDate = new Date(Date.UTC(yr, 0, 1))
      const endDate = new Date(Date.UTC(yr, 11, 31, 23, 59, 59, 999))
      query.date = { $gte: startDate, $lte: endDate }
    }
  } else if (month) {
    const currentYear = new Date().getFullYear()
    const mth = parseInt(month)
    const startDate = new Date(Date.UTC(currentYear, mth - 1, 1))
    const endDate = new Date(Date.UTC(currentYear, mth, 0, 23, 59, 59, 999))
    query.date = { $gte: startDate, $lte: endDate }
  }

  // Fetch transactions sorted latest first
  const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 })

  res.status(200).json({
    success: true,
    count: transactions.length,
    transactions,
  })
})

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, amount, type, category, date, note } = req.body

  const transaction = await Transaction.findById(id)

  if (!transaction) {
    throw new AppError('Transaction not found', 404)
  }

  // Verify ownership
  if (transaction.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to edit this transaction', 403)
  }

  const oldCategory = transaction.category
  const oldDate = new Date(transaction.date)
  const oldType = transaction.type

  if (amount !== undefined) {
    const parsedAmount = Number(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new AppError('Amount must be a valid number greater than zero', 400)
    }
    transaction.amount = parsedAmount
  }

  if (title !== undefined) transaction.title = title
  if (type !== undefined) transaction.type = type
  if (category !== undefined) transaction.category = category
  if (date !== undefined) transaction.date = date
  if (note !== undefined) transaction.note = note

  await transaction.save()

  if (oldType === 'expense') {
    await recalculateBudget(req.user._id, oldCategory, oldDate.getMonth() + 1, oldDate.getFullYear())
  }

  if (transaction.type === 'expense') {
    const newDate = new Date(transaction.date)
    await recalculateBudget(req.user._id, transaction.category, newDate.getMonth() + 1, newDate.getFullYear())
  }

  res.status(200).json({
    success: true,
    message: 'Transaction updated successfully',
    transaction,
  })
})

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params

  const transaction = await Transaction.findById(id)

  if (!transaction) {
    throw new AppError('Transaction not found', 404)
  }

  // Verify ownership
  if (transaction.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to delete this transaction', 403)
  }

  // Purge bound Cloudinary receipt if configured
  if (
    transaction.receipt &&
    transaction.receipt.public_id &&
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
  ) {
    try {
      await cloudinary.uploader.destroy(transaction.receipt.public_id)
    } catch (err) {
      console.error('Error deleting receipt from Cloudinary during transaction deletion:', err)
    }
  }

  await transaction.deleteOne()

  if (transaction.type === 'expense') {
    const txDate = new Date(transaction.date)
    await recalculateBudget(req.user._id, transaction.category, txDate.getMonth() + 1, txDate.getFullYear())
  }

  res.status(200).json({
    success: true,
    message: 'Transaction deleted successfully',
  })
})

// @desc    Get total income, total expense, and balance summary
// @route   GET /api/transactions/summary
// @access  Private
export const getTransactionSummary = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })

  let totalIncome = 0
  let totalExpense = 0

  transactions.forEach((item) => {
    if (item.type === 'income') {
      totalIncome += item.amount
    } else if (item.type === 'expense') {
      totalExpense += item.amount
    }
  })

  const balance = totalIncome - totalExpense

  res.status(200).json({
    success: true,
    summary: {
      totalIncome,
      totalExpense,
      balance,
    },
  })
})

// @desc    Upload a receipt and attach to transaction
// @route   POST /api/transactions/upload-receipt/:id
// @access  Private
export const uploadReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params

  const transaction = await Transaction.findById(id)
  if (!transaction) {
    throw new AppError('Transaction not found', 404)
  }

  // Validate ownership
  if (transaction.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to modify this transaction', 403)
  }

  if (!req.file) {
    throw new AppError('Please select a receipt file to upload', 400)
  }

  const fileExt = path.extname(req.file.originalname).toLowerCase()
  const isPdf = fileExt === '.pdf'
  const fileType = isPdf ? 'pdf' : 'image'

  let uploadResult = {
    secure_url: '',
    public_id: '',
  }

  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET

  if (hasCloudinary) {
    // 1. If an old receipt exists, remove it from Cloudinary
    if (transaction.receipt && transaction.receipt.public_id) {
      try {
        await cloudinary.uploader.destroy(transaction.receipt.public_id)
      } catch (err) {
        console.error('Failed to remove old receipt from Cloudinary:', err)
      }
    }

    // 2. Stream upload new file buffer to Cloudinary
    try {
      const uploadPromise = () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'taxexpense-planner/receipts',
              resource_type: 'auto',
              public_id: `receipt_${id}_${Date.now()}`,
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          uploadStream.end(req.file.buffer)
        })
      }
      const result = await uploadPromise()
      uploadResult.secure_url = result.secure_url
      uploadResult.public_id = result.public_id
    } catch (err) {
      console.error('Cloudinary upload failure:', err)
      throw new AppError(`Receipt upload failed: ${err.message}`, 500)
    }
  } else {
    // DEVELOPER TEST MOCKUP FALLBACK
    console.warn('[CLOUDINARY MOCK] Credentials missing. Running simulated upload.')
    
    // Simulate minor network processing latency
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Use a clean placeholder matching the fileType
    const mockUrl = isPdf
      ? 'https://res.cloudinary.com/demo/image/upload/v1570975139/receipt_placeholder_pdf.png'
      : 'https://res.cloudinary.com/demo/image/upload/v1570975139/receipt_placeholder.png'

    uploadResult.secure_url = mockUrl
    uploadResult.public_id = `mock_receipt_${id}_${Date.now()}`
  }

  // 3. Attach receipt data and save
  transaction.receipt = {
    url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
    fileType,
  }

  await transaction.save()

  res.status(200).json({
    success: true,
    message: 'Receipt uploaded successfully',
    transaction,
  })
})

// @desc    Remove receipt from transaction
// @route   DELETE /api/transactions/remove-receipt/:id
// @access  Private
export const removeReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params

  const transaction = await Transaction.findById(id)
  if (!transaction) {
    throw new AppError('Transaction not found', 404)
  }

  // Validate ownership
  if (transaction.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to modify this transaction', 403)
  }

  // Remove old receipt from Cloudinary if configured
  if (
    transaction.receipt &&
    transaction.receipt.public_id &&
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
  ) {
    try {
      await cloudinary.uploader.destroy(transaction.receipt.public_id)
    } catch (err) {
      console.error('Failed to remove receipt from Cloudinary:', err)
    }
  }

  // Clear schema fields
  transaction.receipt = {
    url: '',
    public_id: '',
    fileType: '',
  }

  await transaction.save()

  res.status(200).json({
    success: true,
    message: 'Receipt removed successfully',
    transaction,
  })
})

// @desc    Scan receipt and return structured auto-fill suggestions
// @route   POST /api/transactions/scan-receipt
// @access  Private
export const scanReceipt = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload a receipt image or PDF file to scan', 400)
  }

  const fileExt = path.extname(req.file.originalname).toLowerCase()
  const isPdf = fileExt === '.pdf'
  const fileType = isPdf ? 'pdf' : 'image'

  try {
    // 1. OCR text extraction
    const rawText = await extractReceiptText(req.file.buffer, fileType)

    // 2. Parsed structured details
    const parsedData = await parseReceiptData(rawText)

    res.status(200).json({
      success: true,
      message: 'Receipt processed and parsed successfully',
      data: parsedData,
    })
  } catch (err) {
    console.error('[OCR Controller Error] Scanning flow failed:', err)
    throw new AppError(`Receipt OCR processing failed: ${err.message}`, 500)
  }
})
