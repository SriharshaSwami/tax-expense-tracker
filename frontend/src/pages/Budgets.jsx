import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import SectionHeader from '../components/ui/SectionHeader'
import EmptyState from '../components/ui/EmptyState'
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '../services/budgetService'
import toast from 'react-hot-toast'

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']

const MONTHS = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 },
]

const YEARS = [
  { name: '2025', value: 2025 },
  { name: '2026', value: 2026 },
  { name: '2027', value: 2027 }
]

const Budgets = () => {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [budgets, setBudgets] = useState([])

  // Filters State
  const currentDate = new Date()
  const [filterMonth, setFilterMonth] = useState(currentDate.getMonth() + 1)
  const [filterYear, setFilterYear] = useState(currentDate.getFullYear())

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [formData, setFormData] = useState({
    category: 'Food',
    monthlyLimit: '',
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    alertThreshold: 80,
  })

  const loadBudgets = async () => {
    setLoading(true)
    try {
      const res = await fetchBudgets(filterMonth, filterYear)
      if (res.success) {
        setBudgets(res.budgets)
      }
    } catch (err) {
      toast.error('Failed to load category budgets')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBudgets()
  }, [filterMonth, filterYear])

  const handleOpenAddModal = () => {
    setEditingBudget(null)
    setFormData({
      category: 'Food',
      monthlyLimit: '',
      month: filterMonth,
      year: filterYear,
      alertThreshold: 80,
    })
    setModalOpen(true)
  }

  const handleOpenEditModal = (budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      monthlyLimit: budget.monthlyLimit,
      month: budget.month,
      year: budget.year,
      alertThreshold: budget.alertThreshold || 80,
    })
    setModalOpen(true)
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()

    if (!formData.category || !formData.monthlyLimit) {
      toast.error('Please complete all required fields')
      return
    }

    const limitVal = Number(formData.monthlyLimit)
    if (isNaN(limitVal) || limitVal <= 0) {
      toast.error('Budget limit must be greater than zero')
      return
    }

    const thresholdVal = Number(formData.alertThreshold)
    if (isNaN(thresholdVal) || thresholdVal < 1 || thresholdVal > 100) {
      toast.error('Alert threshold must be between 1% and 100%')
      return
    }

    try {
      if (editingBudget) {
        const res = await updateBudget(editingBudget._id, {
          monthlyLimit: limitVal,
          alertThreshold: thresholdVal,
        })
        if (res.success) {
          toast.success('Budget cap adjusted!')
          setModalOpen(false)
          loadBudgets()
        }
      } else {
        const res = await createBudget({
          ...formData,
          monthlyLimit: limitVal,
          alertThreshold: thresholdVal,
        })
        if (res.success) {
          toast.success('Category budget created!')
          setModalOpen(false)
          loadBudgets()
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not process budget request')
    }
  }

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to permanently clear this budget limit?')) return
    try {
      const res = await deleteBudget(id)
      if (res.success) {
        toast.success('Budget limit deleted successfully')
        loadBudgets()
      }
    } catch (err) {
      toast.error('Could not delete category budget')
    }
  }

  const formatRupee = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-fin-bg text-fin-text-primary flex flex-col md:flex-row relative overflow-hidden">
      {/* ambient glows */}
      <div className="absolute -top-62.5 -right-37.5 h-150 w-150 rounded-full bg-fin-success/6 dark:bg-fin-success/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute -bottom-37.5 -left-37.5 h-125 w-125 rounded-full bg-fin-info/4 dark:bg-fin-info/8 blur-[120px] pointer-events-none z-0" />

      {/* SIDEBAR NAVIGATION */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* MOBILE INTERACTIVE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-35 bg-fin-overlay backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header user={user} pageTitle="Budget Workspace" setMobileOpen={setMobileMenuOpen} mobileOpen={mobileMenuOpen} />

        {/* MAIN BODY AREA */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6 no-scrollbar"
        >
          {/* Header Action Section */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-fin-border pb-5">
            <SectionHeader
              title="Category Envelopes"
              subtitle="Set boundaries on specific expense areas, configure custom alerts thresholds, and monitor outflows in real-time."
            />
            <Button
              variant="success"
              size="sm"
              onClick={handleOpenAddModal}
              className="self-start sm:self-auto shrink-0"
            >
              <svg className="h-4.5 w-4.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Set Category Envelope
            </Button>
          </div>

          {/* Filtering Period Panel */}
          <Card hoverable={false} className="flex flex-wrap gap-4 items-center justify-between py-4">
            <div className="flex items-center gap-2 text-xs font-bold text-fin-text-secondary uppercase tracking-wider">
              <span>📅 Active Auditing Period</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select
                id="month"
                name="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(Number(e.target.value))}
                options={MONTHS.map(m => ({ value: m.value, label: m.name }))}
                className="py-1 px-3 text-xs"
              />

              <Select
                id="year"
                name="year"
                value={filterYear}
                onChange={(e) => setFilterYear(Number(e.target.value))}
                options={YEARS.map(y => ({ value: y.value, label: y.name }))}
                className="py-1 px-3 text-xs"
              />
            </div>
          </Card>

          {/* Grid Layout of Envelopes */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 text-fin-text-muted">
              <svg className="animate-spin h-7 w-7 text-fin-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs font-bold uppercase tracking-wider">Loading active envelopes...</p>
            </div>
          ) : budgets.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {budgets.map((b) => {
                const percent = b.monthlyLimit > 0 ? (b.spentAmount / b.monthlyLimit) * 100 : 0
                const isExceeded = b.spentAmount >= b.monthlyLimit
                const isWarning = percent >= (b.alertThreshold || 80) && !isExceeded
                const remaining = b.monthlyLimit - b.spentAmount

                return (
                  <Card key={b._id} className="flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      {/* Card Header Category Badge */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-xl bg-fin-input-bg dark:bg-fin-input-bg border border-fin-border px-3 py-1 text-xs font-extrabold text-fin-text-secondary">
                          {b.category}
                        </span>
                        
                        {/* Alert Badges */}
                        {isExceeded ? (
                          <span className="rounded-full bg-fin-danger/12 border border-fin-danger/25 px-2.5 py-0.5 text-[9px] font-extrabold text-fin-danger uppercase tracking-wider animate-pulse">
                            🚨 Exceeded
                          </span>
                        ) : isWarning ? (
                          <span className="rounded-full bg-fin-warning/12 border border-fin-warning/25 px-2.5 py-0.5 text-[9px] font-extrabold text-fin-warning uppercase tracking-wider">
                            ⚠️ Warning ({b.alertThreshold}%)
                          </span>
                        ) : (
                          <span className="rounded-full bg-fin-success/12 border border-fin-success/25 px-2.5 py-0.5 text-[9px] font-extrabold text-fin-success uppercase tracking-wider">
                            ✔ Optimized
                          </span>
                        )}
                      </div>

                      {/* Amounts Info */}
                      <div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xl font-black tracking-tight text-fin-text-primary">{formatRupee(b.spentAmount)}</span>
                          <span className="text-xs font-bold text-fin-text-muted">of {formatRupee(b.monthlyLimit)} limit</span>
                        </div>

                        {/* progress bar */}
                        <div className="mt-3">
                          <div className="h-2 w-full rounded-full bg-fin-border overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, percent)}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                isExceeded ? 'bg-fin-danger' : isWarning ? 'bg-fin-warning' : 'bg-fin-success'
                              }`}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-fin-text-muted font-bold mt-1.5">
                            <span>{percent.toFixed(0)}% consumed</span>
                            <span>
                              {remaining >= 0 ? `${formatRupee(remaining)} remaining` : `${formatRupee(Math.abs(remaining))} over limit`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card actions */}
                    <div className="pt-4 border-t border-fin-border flex items-center justify-between">
                      <span className="text-[9px] font-bold text-fin-text-muted uppercase tracking-wider">
                        {MONTHS.find(m => m.value === b.month)?.name} {b.year}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(b)}
                          className="rounded-lg p-1.5 text-fin-text-muted hover:bg-fin-hover-bg hover:text-fin-text-secondary transition cursor-pointer"
                          title="Edit Limit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBudget(b._id)}
                          className="rounded-lg p-1.5 text-fin-text-muted hover:bg-fin-danger/10 hover:text-fin-danger transition cursor-pointer"
                          title="Delete Limit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="py-8">
              <EmptyState
                title="No Budget Envelopes Set"
                description="Set monthly spending limits on category tags (e.g. Food, Travel, Shopping) to get real-time warning indicators when you reach thresholds."
                actionLabel="Configure Envelope"
                onActionClick={handleOpenAddModal}
              />
            </div>
          )}

          {/* DYNAMIC FORM MODAL (Add / Edit) */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={editingBudget ? 'Adjust Envelope Cap' : 'Configure Envelope Cap'}
            size="sm"
            footerActions={
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleModalSubmit}
                >
                  {editingBudget ? 'Save Changes' : 'Create Budget'}
                </Button>
              </>
            }
          >
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Category */}
              <Select
                id="category"
                name="category"
                label="Category Tag"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={!!editingBudget}
                options={EXPENSE_CATEGORIES.map(c => ({ value: c, label: c }))}
              />

              {/* Limit Amount */}
              <Input
                id="monthlyLimit"
                name="monthlyLimit"
                type="number"
                required
                label="Monthly Limit Cap (₹)"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                placeholder="e.g. 10000"
              />

              {/* Month & Year Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="month"
                  name="month"
                  label="Month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                  disabled={!!editingBudget}
                  options={MONTHS.map(m => ({ value: m.value, label: m.name }))}
                />

                <Select
                  id="year"
                  name="year"
                  label="Year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  disabled={!!editingBudget}
                  options={YEARS.map(y => ({ value: y.value, label: y.name }))}
                />
              </div>

              {/* Alert Threshold Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-fin-text-secondary">
                  <span>Warning Threshold</span>
                  <span className="text-fin-success font-extrabold">{formData.alertThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={formData.alertThreshold}
                  onChange={(e) => setFormData({ ...formData, alertThreshold: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                />
                <p className="text-[10px] text-fin-text-muted leading-relaxed">
                  Get real-time notification alerts when total categorised monthly outflows reach {formData.alertThreshold}% of envelope limit caps.
                </p>
              </div>
            </form>
          </Modal>

        </motion.main>
      </div>
    </div>
  )
}

export default Budgets
