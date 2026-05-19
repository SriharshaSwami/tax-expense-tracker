import React, { useState } from 'react'
import { useTransactions } from '../../context/TransactionContext'
import FileUpload from '../common/FileUpload'
import PreviewModal from '../common/PreviewModal'
import { uploadReceiptFile, deleteReceiptFile } from '../../services/transactionService'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import EmptyState from '../ui/EmptyState'

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Business', 'Other']

const MONTHS = [
  { name: 'All Months', value: '' },
  { name: 'January', value: '1' },
  { name: 'February', value: '2' },
  { name: 'March', value: '3' },
  { name: 'April', value: '4' },
  { name: 'May', value: '5' },
  { name: 'June', value: '6' },
  { name: 'July', value: '7' },
  { name: 'August', value: '8' },
  { name: 'September', value: '9' },
  { name: 'October', value: '10' },
  { name: 'November', value: '11' },
  { name: 'December', value: '12' },
]

const YEARS = [
  { name: 'All Years', value: '' },
  { name: '2025', value: '2025' },
  { name: '2026', value: '2026' },
  { name: '2027', value: '2027' },
]

const TransactionList = () => {
  const {
    transactions,
    loading,
    filters,
    updateFilters,
    resetFilters,
    editTransaction,
    removeTransaction,
  } = useTransactions()

  // State for Edit Modal
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [editFormData, setEditFormData] = useState({
    title: '',
    amount: '',
    type: '',
    category: '',
    date: '',
    note: '',
  })
  const [editErrors, setEditErrors] = useState({})
  const [savingEdit, setSavingEdit] = useState(false)

  // States for Receipt Upload and preview overlays
  const [editReceiptFile, setEditReceiptFile] = useState(null)
  const [receiptToRemove, setReceiptToRemove] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value })
  }

  // Handle Filter Dropdowns
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    updateFilters({ [name]: value })
  }

  // Open Edit Modal
  const openEditModal = (t) => {
    const formattedDate = new Date(t.date).toISOString().split('T')[0]
    setEditingTransaction(t)
    setEditFormData({
      title: t.title,
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: formattedDate,
      note: t.note || '',
    })
    setEditReceiptFile(null)
    setReceiptToRemove(false)
    setEditErrors({})
  }

  // Close Edit Modal
  const closeEditModal = () => {
    setEditingTransaction(null)
  }

  // Handle Edit Input Change
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === 'type') {
        updated.category = value === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]
      }
      return updated
    })
  }

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    // Validate Edit
    const errors = {}
    if (!editFormData.title.trim()) errors.title = 'Title is required'
    if (!editFormData.amount || Number(editFormData.amount) <= 0) errors.amount = 'Amount must be greater than zero'
    if (!editFormData.date) errors.date = 'Date is required'

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors)
      return
    }

    setSavingEdit(true)
    try {
      if (receiptToRemove && editingTransaction.receipt && editingTransaction.receipt.url) {
        await deleteReceiptFile(editingTransaction._id)
      }

      const updatedTx = await editTransaction(editingTransaction._id, {
        ...editFormData,
        amount: Number(editFormData.amount),
      })

      if (updatedTx && editReceiptFile) {
        await uploadReceiptFile(editingTransaction._id, editReceiptFile)
      }

      closeEditModal()
    } catch (err) {
      console.error(err)
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently clear this record?')) {
      await removeTransaction(id)
    }
  }

  const handlePreviewClick = (t) => {
    if (t.receipt && t.receipt.url) {
      if (t.receipt.fileType === 'pdf') {
        window.open(t.receipt.url, '_blank')
      } else {
        setPreviewUrl(t.receipt.url)
        setPreviewTitle(t.title)
        setPreviewOpen(true)
      }
    }
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const activeEditCategories = editFormData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  return (
    <div className="space-y-6">
      {/* FILTER PANEL */}
      <Card hoverable={false} className="glass-panel">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight text-fin-text-primary">Ledger History</h3>
            <p className="text-xs text-fin-text-muted mt-0.5">Filter, audit, and inspect all ledger records</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="self-start text-[11px] border border-fin-border"
          >
            Clear Filters
          </Button>
        </div>

        {/* Filters Grid */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {/* Search */}
          <div className="sm:col-span-2 md:col-span-1">
            <Input
              type="text"
              label="Search keyword"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search description..."
            />
          </div>

          {/* Type */}
          <div>
            <Select
              id="type"
              name="type"
              label="Type"
              value={filters.type}
              onChange={handleFilterChange}
              options={[
                { value: '', label: 'All Types' },
                { value: 'income', label: 'Income (+)' },
                { value: 'expense', label: 'Expense (-)' }
              ]}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-fin-text-secondary mb-1.5">
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full appearance-none rounded-xl border border-fin-border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 px-4 py-2.5 text-sm text-fin-text-primary outline-hidden focus:bg-white dark:focus:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer pr-10"
              >
                <option value="" className="bg-white dark:bg-slate-900 text-fin-text-primary">All Categories</option>
                <optgroup label="Income" className="bg-white dark:bg-slate-900 text-fin-text-primary font-bold">
                  {INCOME_CATEGORIES.map(c => <option key={`in-${c}`} value={c}>{c}</option>)}
                </optgroup>
                <optgroup label="Expense" className="bg-white dark:bg-slate-900 text-fin-text-primary font-bold">
                  {EXPENSE_CATEGORIES.map(c => <option key={`ex-${c}`} value={c}>{c}</option>)}
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-fin-text-muted">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Month */}
          <div>
            <Select
              id="month"
              name="month"
              label="Month"
              value={filters.month}
              onChange={handleFilterChange}
              options={MONTHS.map(m => ({ value: m.value, label: m.name }))}
            />
          </div>

          {/* Year */}
          <div>
            <Select
              id="year"
              name="year"
              label="Year"
              value={filters.year}
              onChange={handleFilterChange}
              options={YEARS.map(y => ({ value: y.value, label: y.name }))}
            />
          </div>
        </div>
      </Card>

      {/* TRANSACTION LIST */}
      <Card hoverable={false} className="glass-panel p-0 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-fin-text-muted space-y-3">
            <svg className="animate-spin h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-wider">Loading auditing ledger...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Ledger Records Found"
              description="We couldn't find any financial transactions matching your query filter conditions. Please record a new transaction or reset active parameters."
              actionLabel="Clear Filters"
              onActionClick={resetFilters}
            />
          </div>
        ) : (
          <div className="divide-y divide-fin-border">
            {transactions.map((t) => (
              <div
                key={t._id}
                className="group flex flex-col justify-between p-5 sm:flex-row sm:items-center hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition duration-150"
              >
                {/* Info block */}
                <div className="flex items-start space-x-4">
                  {/* Plus/minus badge */}
                  <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-base shadow-fin-sm ${
                    t.type === 'income' 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-550 dark:text-rose-400'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}
                  </div>

                  <div>
                    <h5 className="font-bold text-fin-text-primary text-sm transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {t.title}
                    </h5>
                    
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-fin-text-muted">
                      <span>{formatDate(t.date)}</span>
                      <span className="h-1 w-1 rounded-full bg-fin-border" />
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${
                        t.type === 'income' 
                          ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/15' 
                          : 'bg-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-500/15'
                      }`}>
                        {t.category}
                      </span>
                      {t.receipt && t.receipt.url && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-fin-border" />
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 rounded-full px-2.5 py-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-3 w-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.656-5.656l-3.394 3.394m3.394-3.394l-.009-.013" />
                            </svg>
                            Receipt
                          </span>
                        </>
                      )}
                    </div>

                    {t.note && (
                      <p className="mt-1.5 text-xs text-fin-text-muted max-w-md line-clamp-1 italic">
                        Note: {t.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount and editing triggers */}
                <div className="mt-4 flex items-center justify-between border-t border-fin-border pt-3.5 sm:mt-0 sm:border-0 sm:pt-0 space-x-6">
                  <span className={`text-base font-black tracking-tight ${
                    t.type === 'income' ? 'text-emerald-600 dark:text-emerald-405' : 'text-fin-text-primary'
                  }`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </span>

                  {/* Icon Actions */}
                  <div className="flex items-center space-x-1.5">
                    {t.receipt && t.receipt.url && (
                      <button
                        type="button"
                        onClick={() => handlePreviewClick(t)}
                        className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-500/10 transition cursor-pointer"
                        title="View Receipt File"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4.5 w-4.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openEditModal(t)}
                      className="rounded-lg p-1.5 text-fin-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-fin-text-secondary transition cursor-pointer"
                      title="Edit Entry"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4.5 w-4.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t._id)}
                      className="rounded-lg p-1.5 text-fin-text-muted hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition cursor-pointer"
                      title="Clear Entry"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4.5 w-4.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* EDIT MODAL DIALOG */}
      <Modal
        isOpen={!!editingTransaction}
        onClose={closeEditModal}
        title="Edit Audit Entry"
        footerActions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={closeEditModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleEditSubmit}
              disabled={savingEdit}
              loading={savingEdit}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4" noValidate>
          {/* Title */}
          <Input
            id="edit-title"
            name="title"
            label="Transaction Title"
            value={editFormData.title}
            onChange={handleEditChange}
            error={editErrors.title}
            placeholder="e.g. Shopping bills"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Amount */}
            <Input
              id="edit-amount"
              name="amount"
              label="Amount (₹)"
              type="number"
              required
              min="0.01"
              step="any"
              value={editFormData.amount}
              onChange={handleEditChange}
              error={editErrors.amount}
            />

            {/* Type */}
            <Select
              id="edit-type"
              name="type"
              label="Type"
              value={editFormData.type}
              onChange={handleEditChange}
              options={[
                { value: 'expense', label: 'Expense (-)' },
                { value: 'income', label: 'Income (+)' }
              ]}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Category */}
            <Select
              id="edit-category"
              name="category"
              label="Category"
              value={editFormData.category}
              onChange={handleEditChange}
              options={activeEditCategories.map(c => ({ value: c, label: c }))}
            />

            {/* Date */}
            <Input
              id="edit-date"
              name="date"
              label="Date"
              type="date"
              required
              value={editFormData.date}
              onChange={handleEditChange}
              error={editErrors.date}
            />
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label htmlFor="edit-note" className="block text-xs font-bold uppercase tracking-wider text-fin-text-secondary">Notes (Optional)</label>
            <textarea
              id="edit-note"
              name="note"
              rows="2"
              value={editFormData.note}
              onChange={handleEditChange}
              className="w-full rounded-xl border border-fin-border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 px-4 py-2.5 text-sm text-fin-text-primary outline-hidden focus:bg-white dark:focus:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none"
            />
          </div>

          {/* File Upload Zone */}
          <div className="border-t border-fin-border pt-4">
            <FileUpload
              file={editReceiptFile}
              setFile={setEditReceiptFile}
              existingReceipt={
                receiptToRemove
                  ? null
                  : editingTransaction?.receipt && editingTransaction?.receipt?.url
                  ? editingTransaction.receipt
                  : null
              }
              onRemoveExisting={() => setReceiptToRemove(true)}
            />
          </div>
        </form>
      </Modal>

      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        receiptUrl={previewUrl}
        transactionTitle={previewTitle}
      />
    </div>
  )
}

export default TransactionList
