import React, { useState, useEffect } from 'react'
import { useTransactions } from '../../context/TransactionContext'
import FileUpload from '../common/FileUpload'
import { uploadReceiptFile } from '../../services/transactionService'
import OCRPreviewModal from '../common/OCRPreviewModal'
import { scanReceiptFile } from '../../services/insightsService'
import toast from 'react-hot-toast'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Select from '../ui/Select'

const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
]

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Other',
]

const TransactionForm = () => {
  const { addTransaction } = useTransactions()
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [receiptFile, setReceiptFile] = useState(null)

  // OCR modal and parsing states
  const [ocrModalOpen, setOcrModalOpen] = useState(false)
  const [ocrScanning, setOcrScanning] = useState(false)
  const [ocrParsedData, setOcrParsedData] = useState(null)

  const handleScanReceipt = async (file) => {
    if (!file) return
    setOcrModalOpen(true)
    setOcrScanning(true)
    setOcrParsedData(null)
    try {
      const res = await scanReceiptFile(file)
      if (res && res.success) {
        setOcrParsedData(res.data)
      } else {
        toast.error('Scanning failed: Invalid response')
        setOcrModalOpen(false)
      }
    } catch (err) {
      console.error('[OCR Frontend Error]:', err)
      toast.error(err.response?.data?.message || 'Receipt scanning failed')
      setOcrModalOpen(false)
    } finally {
      setOcrScanning(false)
    }
  }

  const handleApplyOcrData = (data) => {
    setFormData({
      title: data.title || '',
      amount: data.amount || '',
      type: data.type || 'expense',
      category: data.category || 'Other',
      date: data.date || new Date().toISOString().split('T')[0],
      note: data.note || '',
    })
    toast.success('Fields auto-filled successfully!')
  }

  // Automatically select first category option when type changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      category: prev.type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0],
    }))
  }, [formData.type])

  const validate = () => {
    const tempErrors = {}
    if (!formData.title.trim()) tempErrors.title = 'Title is required'
    
    if (!formData.amount) {
      tempErrors.amount = 'Amount is required'
    } else {
      const num = Number(formData.amount)
      if (isNaN(num) || num <= 0) {
        tempErrors.amount = 'Amount must be greater than zero'
      }
    }

    if (!formData.category) tempErrors.category = 'Category is required'
    if (!formData.date) tempErrors.date = 'Date is required'

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const newTx = await addTransaction({
        ...formData,
        amount: Number(formData.amount),
      })

      if (newTx && receiptFile) {
        await uploadReceiptFile(newTx._id, receiptFile)
      }

      setFormData((prev) => ({
        ...prev,
        title: '',
        amount: '',
        note: '',
      }))
      setReceiptFile(null)
    } catch (err) {
      console.error('Failed to submit transaction:', err)
    } finally {
      setLoading(false)
    }
  }

  const activeCategories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  return (
    <Card hoverable={false} className="glass-panel">
      <h3 className="text-base font-bold tracking-tight text-fin-text-primary">Add Transaction</h3>
      <p className="text-xs text-fin-text-muted mt-0.5">Record a new expense or income item in your ledger</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        {/* Title Input */}
        <Input
          id="title"
          name="title"
          label="Transaction Title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="e.g. Weekly Groceries"
        />

        {/* Amount & Type Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="amount"
            name="amount"
            label="Amount (₹)"
            type="number"
            required
            min="0.01"
            step="any"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            placeholder="0.00"
          />

          <Select
            id="type"
            name="type"
            label="Transaction Type"
            value={formData.type}
            onChange={handleChange}
            options={[
              { value: 'expense', label: 'Expense (-)' },
              { value: 'income', label: 'Income (+)' }
            ]}
          />
        </div>

        {/* Category & Date Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="category"
            name="category"
            label="Category"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            options={activeCategories.map((c) => ({ value: c, label: c }))}
          />

          <Input
            id="date"
            name="date"
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
          />
        </div>

        {/* Notes (Optional) */}
        <div className="space-y-1.5">
          <label htmlFor="note" className="block text-xs font-bold uppercase tracking-wider text-fin-text-secondary">
            Notes (Optional)
          </label>
          <textarea
            id="note"
            name="note"
            rows="2.5"
            value={formData.note}
            onChange={handleChange}
            placeholder="Add specific details or annotations..."
            className="w-full rounded-xl border border-fin-border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 px-4 py-2.5 text-sm text-fin-text-primary outline-hidden focus:bg-white dark:focus:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none"
          />
        </div>

        {/* File OCR Scan Zone */}
        <div className="border border-dashed border-fin-border rounded-xl p-2 bg-slate-50/20">
          <FileUpload
            file={receiptFile}
            setFile={setReceiptFile}
            onScan={handleScanReceipt}
          />
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          loading={loading}
          className="w-full mt-2"
        >
          Save Transaction
        </Button>
      </form>

      {/* OCR Scanner Preview Modal */}
      <OCRPreviewModal
        isOpen={ocrModalOpen}
        onClose={() => setOcrModalOpen(false)}
        isScanning={ocrScanning}
        parsedData={ocrParsedData}
        onApply={handleApplyOcrData}
      />
    </Card>
  )
}

export default TransactionForm
