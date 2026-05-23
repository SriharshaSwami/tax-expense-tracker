import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import SectionHeader from '../components/ui/SectionHeader'
import EmptyState from '../components/ui/EmptyState'
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../services/goalService'
import toast from 'react-hot-toast'

const SavingsGoals = () => {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [goals, setGoals] = useState([])

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
  })

  // Quick Contribute State
  const [contributeGoal, setContributeGoal] = useState(null)
  const [contributeAmount, setContributeAmount] = useState('')

  const loadGoals = async () => {
    setLoading(true)
    try {
      const res = await fetchGoals()
      if (res.success) {
        setGoals(res.goals)
      }
    } catch (err) {
      toast.error('Failed to load savings milestones')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleOpenAddModal = () => {
    setEditingGoal(null)
    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: '',
    })
    setModalOpen(true)
  }

  const handleOpenEditModal = (goal) => {
    setEditingGoal(goal)
    const formattedDeadline = goal.deadline ? new Date(goal.deadline).toISOString().substring(0, 10) : ''
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: formattedDeadline,
    })
    setModalOpen(true)
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      toast.error('Please fill in all required fields')
      return
    }

    const targetVal = Number(formData.targetAmount)
    if (isNaN(targetVal) || targetVal <= 0) {
      toast.error('Target amount must be greater than zero')
      return
    }

    const currentVal = Number(formData.currentAmount)
    if (isNaN(currentVal) || currentVal < 0) {
      toast.error('Saved contribution cannot be negative')
      return
    }

    const deadlineDate = new Date(formData.deadline)
    if (deadlineDate < new Date() && !editingGoal) {
      toast.error('Deadline cannot be in the past')
      return
    }

    try {
      if (editingGoal) {
        const res = await updateGoal(editingGoal._id, {
          title: formData.title,
          targetAmount: targetVal,
          currentAmount: currentVal,
          deadline: formData.deadline,
        })
        if (res.success) {
          toast.success('Milestone details updated!')
          setModalOpen(false)
          loadGoals()
        }
      } else {
        const res = await createGoal({
          title: formData.title,
          targetAmount: targetVal,
          currentAmount: currentVal,
          deadline: formData.deadline,
        })
        if (res.success) {
          toast.success('Savings target established!')
          setModalOpen(false)
          loadGoals()
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process savings goal')
    }
  }

  const handleOpenContribute = (goal) => {
    setContributeGoal(goal)
    setContributeAmount('')
  }

  const handleContributeSubmit = async (e) => {
    e.preventDefault()
    if (!contributeAmount || isNaN(Number(contributeAmount)) || Number(contributeAmount) <= 0) {
      toast.error('Please enter a valid amount to contribute')
      return
    }

    const added = Number(contributeAmount)
    const newTotal = contributeGoal.currentAmount + added

    try {
      const res = await updateGoal(contributeGoal._id, {
        currentAmount: newTotal,
      })
      if (res.success) {
        toast.success(`Allocated ${formatRupee(added)} to "${contributeGoal.title}"!`)
        setContributeGoal(null)
        loadGoals()
      }
    } catch (err) {
      toast.error('Failed to register contribution')
    }
  }

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to permanently clear this savings milestone?')) return
    try {
      const res = await deleteGoal(id)
      if (res.success) {
        toast.success('Savings milestone cleared successfully')
        loadGoals()
      }
    } catch (err) {
      toast.error('Could not delete savings goal')
    }
  }

  const formatRupee = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const getDaysRemaining = (deadlineStr) => {
    const diff = new Date(deadlineStr) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Expired'
    if (days === 0) return 'Today'
    return `${days} days remaining`
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
        <Header user={user} pageTitle="Savings Workspace" setMobileOpen={setMobileMenuOpen} mobileOpen={mobileMenuOpen} />

        {/* MAIN BODY AREA */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6 no-scrollbar"
        >
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-fin-border pb-5">
            <SectionHeader
              title="Savings Milestones"
              subtitle="Establish saving goals for high-priority targets, track monthly deposits progress, and verify countdown timelines."
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
              Establish Target Milestone
            </Button>
          </div>

          {/* Goals Dashboard Panel */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 text-fin-text-muted">
              <svg className="animate-spin h-7 w-7 text-fin-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs font-bold uppercase tracking-wider">Loading active milestones...</p>
            </div>
          ) : goals.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {goals.map((g) => {
                const percent = Math.min(100, (g.currentAmount / g.targetAmount) * 100)
                const isCompleted = g.status === 'completed' || percent >= 100
                const daysLeft = getDaysRemaining(g.deadline)
                const remainingAmount = g.targetAmount - g.currentAmount

                return (
                  <Card key={g._id} className="flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      {/* Card Header Status Indicator */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-fin-text-primary tracking-tight truncate block max-w-[65%]">
                          {g.title}
                        </span>

                        {isCompleted ? (
                          <span className="rounded-full bg-fin-success/10 border border-fin-success/20 px-2.5 py-0.5 text-[9px] font-extrabold text-fin-success uppercase tracking-wider shrink-0">
                            🏆 Achieved
                          </span>
                        ) : percent >= 50 ? (
                          <span className="rounded-full bg-fin-primary/12 border border-fin-primary/25 px-2.5 py-0.5 text-[9px] font-extrabold text-fin-primary uppercase tracking-wider shrink-0">
                            🌟 Halfway (50%+)
                          </span>
                        ) : (
                          <span className="rounded-full bg-fin-warning/12 border border-fin-warning/25 px-2.5 py-0.5 text-[9px] font-extrabold text-fin-warning uppercase tracking-wider shrink-0">
                            📈 Active
                          </span>
                        )}
                      </div>

                      {/* Cash Metrics breakdown */}
                      <div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xl font-black tracking-tight text-fin-text-primary">{formatRupee(g.currentAmount)}</span>
                          <span className="text-xs font-bold text-fin-text-muted">target: {formatRupee(g.targetAmount)}</span>
                        </div>

                        {/* Progress slider bar */}
                        <div className="mt-3">
                          <div className="h-2 w-full rounded-full bg-fin-border overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                isCompleted ? 'bg-fin-success' : 'bg-fin-success'
                              }`}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-fin-text-muted font-bold mt-1.5">
                            <span>{percent.toFixed(0)}% accumulated</span>
                            <span>{remainingAmount > 0 ? `${formatRupee(remainingAmount)} to go` : 'Fully Funded!'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons & count footer */}
                    <div className="pt-4 border-t border-fin-border flex items-center justify-between">
                      <div className="flex flex-col text-[9px] font-bold text-fin-text-muted uppercase tracking-wider leading-normal">
                        <span>Milestone: {new Date(g.deadline).toLocaleDateString('en-IN')}</span>
                        <span className={daysLeft === 'Expired' ? 'text-fin-danger' : 'text-fin-text-muted'}>
                          {daysLeft}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {/* Contribution Button */}
                        {!isCompleted && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleOpenContribute(g)}
                            className="py-1 px-2.5 text-[10px] mr-1"
                          >
                            💰 Save
                          </Button>
                        )}
                        
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(g)}
                          className="rounded-lg p-1.5 text-fin-text-muted hover:bg-fin-hover-bg hover:text-fin-text-secondary transition cursor-pointer"
                          title="Modify"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteGoal(g._id)}
                          className="rounded-lg p-1.5 text-fin-text-muted hover:bg-fin-danger/10 hover:text-fin-danger transition cursor-pointer"
                          title="Purge"
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
                title="No Savings Milestones Established"
                description="Create custom saving goals (e.g. Purchase funds, emergency streams, investment reserves) to monitor streaks and timeline countdowns."
                actionLabel="Establish Milestone Goal"
                onActionClick={handleOpenAddModal}
              />
            </div>
          )}

          {/* DYNAMIC FORM MODAL (Add / Edit) */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={editingGoal ? 'Edit Savings Target' : 'Establish Savings Goal'}
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
                  {editingGoal ? 'Save Changes' : 'Launch Goal'}
                </Button>
              </>
            }
          >
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <Input
                id="title"
                name="title"
                type="text"
                required
                label="Goal Description / Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. New Macbook Pro, Trip to Bali"
              />

              <Input
                id="targetAmount"
                name="targetAmount"
                type="number"
                required
                label="Target Fund Goal (₹)"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="e.g. 150000"
              />

              <Input
                id="currentAmount"
                name="currentAmount"
                type="number"
                label="Initial Saved Deposit (₹)"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                placeholder="0"
              />

              <Input
                id="deadline"
                name="deadline"
                type="date"
                required
                label="Milestone Target Date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </form>
          </Modal>

          {/* QUICK CONTRIBUTE MODAL */}
          <Modal
            isOpen={!!contributeGoal}
            onClose={() => setContributeGoal(null)}
            title={contributeGoal ? `Add Contribution: "${contributeGoal.title}"` : 'Milestone Contribution'}
            footerActions={
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setContributeGoal(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleContributeSubmit}
                >
                  Confirm Allocation
                </Button>
              </>
            }
          >
            {contributeGoal && (
              <form onSubmit={handleContributeSubmit} className="space-y-4">
                <Input
                  id="contributeAmount"
                  name="contributeAmount"
                  type="number"
                  required
                  label="Contribution Amount (₹)"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  autoFocus
                  helperText={`Saved: ${formatRupee(contributeGoal.currentAmount)} / Target: ${formatRupee(contributeGoal.targetAmount)}`}
                />

                {/* Quick Presets */}
                <div className="grid grid-cols-3 gap-3.5 pt-1">
                  {[1000, 5000, 10000].map((val) => (
                    <Button
                      key={val}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setContributeAmount(val.toString())}
                      className="text-xs"
                    >
                      +{formatRupee(val)}
                    </Button>
                  ))}
                </div>
              </form>
            )}
          </Modal>

        </motion.main>
      </div>
    </div>
  )
}

export default SavingsGoals
