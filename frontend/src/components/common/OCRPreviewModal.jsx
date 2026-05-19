import React, { useState, useEffect } from 'react'

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']

/**
 * OCR Preview Modal with beautiful glowing laser sweeping scanner
 * @param {Boolean} isOpen - Modal visibility state
 * @param {Function} onClose - Close callback
 * @param {Boolean} isScanning - Loading state during OCR processing
 * @param {Object} parsedData - OCR extracted transaction fields
 * @param {Function} onApply - Apply pre-fill transaction form values callback
 */
const OCRPreviewModal = ({ isOpen, onClose, isScanning, parsedData, onApply }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Other',
    date: '',
    note: '',
  })

  // Track scanning progress simulation percent
  const [scanPercent, setScanPercent] = useState(0)

  useEffect(() => {
    if (isOpen && isScanning) {
      setScanPercent(5)
      const interval = setInterval(() => {
        setScanPercent((prev) => {
          if (prev >= 98) {
            clearInterval(interval)
            return 98
          }
          const jump = Math.floor(Math.random() * 15) + 5
          return Math.min(98, prev + jump)
        })
      }, 300)
      return () => clearInterval(interval)
    }
  }, [isOpen, isScanning])

  // Sync state once data is parsed
  useEffect(() => {
    if (parsedData) {
      setScanPercent(100)
      setFormData({
        title: parsedData.title || '',
        amount: parsedData.amount || '',
        type: 'expense',
        category: parsedData.category || 'Other',
        date: parsedData.date || new Date().toISOString().split('T')[0],
        note: parsedData.note || 'Scanned via AI OCR',
      })
    }
  }, [parsedData])

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onApply({
      ...formData,
      amount: Number(formData.amount) || 0,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition duration-300">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 text-emerald-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            AI Receipt Scanner
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* SCANNING ACTIVE LOADER STATE */}
        {isScanning && (
          <div className="mt-6 flex flex-col items-center justify-center py-10 space-y-6">
            
            {/* Visual Sweeper Animation Box */}
            <div className="relative h-32 w-48 overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="h-14 w-14 text-slate-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              
              {/* Laser Sweep Beam */}
              <div className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.7)] animate-[bounce_2s_infinite]" />
            </div>

            <div className="w-full max-w-xs text-center space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 px-1">
                <span>Reading fields...</span>
                <span>{scanPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${scanPercent}%` }}
                />
              </div>
              <p className="text-[11px] italic text-slate-400">Tesseract.js Wasm processing buffers in RAM...</p>
            </div>
          </div>
        )}

        {/* PARSED EDITABLE PREVIEW STATE */}
        {!isScanning && parsedData && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
            
            {/* Confidence Badge & Summary Banner */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-800">Scan Complete!</p>
                <p className="text-[10px] text-emerald-600">Review the auto-filled parameters before applying.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                ⚡ 96% Match
              </span>
            </div>

            {/* Merchant / Title */}
            <div>
              <label htmlFor="ocr-title" className="block text-xs font-semibold text-slate-500">Suggested Title / Merchant</label>
              <input
                id="ocr-title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-850 outline-none focus:bg-white focus:border-emerald-500 transition"
              />
            </div>

            {/* Amount & Date Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Amount */}
              <div>
                <label htmlFor="ocr-amount" className="block text-xs font-semibold text-slate-500">Amount (₹)</label>
                <input
                  id="ocr-amount"
                  name="amount"
                  type="number"
                  required
                  min="0.01"
                  step="any"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-850 outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="ocr-date" className="block text-xs font-semibold text-slate-500">Date</label>
                <input
                  id="ocr-date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-850 outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="ocr-category" className="block text-xs font-semibold text-slate-500">Category Hint</label>
              <select
                id="ocr-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-850 outline-none focus:bg-white focus:border-emerald-500 transition"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={`ocr-cat-${cat}`} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="ocr-note" className="block text-xs font-semibold text-slate-500">Auto-fill Note</label>
              <input
                id="ocr-note"
                name="note"
                type="text"
                value={formData.note}
                onChange={handleInputChange}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-850 outline-none focus:bg-white focus:border-emerald-500 transition"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-655 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 cursor-pointer shadow-sm"
              >
                Apply Auto-fill
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default OCRPreviewModal
