import express from 'express'
import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  uploadReceipt,
  removeReceipt,
  scanReceipt,
} from '../controllers/transaction.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js'

const router = express.Router()

// Protect all transaction routes
router.use(protectRoute)

// Summary endpoint MUST be before standard parameter routes like /:id
router.get('/summary', getTransactionSummary)

// CRUD routes
router.post('/', addTransaction)
router.get('/', getTransactions)
router.put('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

// Receipt Management
router.post('/scan-receipt', upload.single('receipt'), scanReceipt)
router.post('/upload-receipt/:id', upload.single('receipt'), uploadReceipt)
router.delete('/remove-receipt/:id', removeReceipt)

export default router
