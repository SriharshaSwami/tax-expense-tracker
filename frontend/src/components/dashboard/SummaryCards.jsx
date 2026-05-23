import React from 'react'
import { motion } from 'framer-motion'
import incomeIcon from '../../assets/icons/income.svg'
import expenseIcon from '../../assets/icons/expense.svg'

const SummaryCards = ({ summary, loading }) => {
  const { totalIncome = 0, totalExpense = 0, balance = 0 } = summary || {}

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const skeletonCard = (
    <div className="h-32 animate-pulse rounded-2xl border border-fin-border dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 shadow-fin-sm" />
  )

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-3">
        {skeletonCard}
        {skeletonCard}
        {skeletonCard}
      </div>
    )
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-3"
    >
      {/* Total Income Card */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, boxShadow: 'var(--shadow-fin-md)' }}
        className="group relative overflow-hidden rounded-2xl border border-fin-border bg-fin-card p-6 shadow-fin-sm transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-fin-text-muted">Total Income</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-fin-success">
              {formatCurrency(totalIncome)}
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fin-success/15 text-fin-success shadow-fin-sm">
            <img src={incomeIcon} alt="Total income" className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-[10px] text-fin-text-muted font-bold uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-fin-success mr-2" />
          Live earnings ledger synced
        </div>
      </motion.div>

      {/* Total Expense Card */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, boxShadow: 'var(--shadow-fin-md)' }}
        className="group relative overflow-hidden rounded-2xl border border-fin-border bg-fin-card p-6 shadow-fin-sm transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-fin-text-muted">Total Expense</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-fin-danger">
              {formatCurrency(totalExpense)}
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fin-danger/15 text-fin-danger shadow-fin-sm">
            <img src={expenseIcon} alt="Total expense" className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-[10px] text-fin-text-muted font-bold uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-fin-danger mr-2" />
          Active outflows recorded
        </div>
      </motion.div>

      {/* Net Balance Card */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, boxShadow: 'var(--shadow-fin-md)' }}
        className="group relative overflow-hidden rounded-2xl border border-fin-border bg-fin-card p-6 shadow-fin-sm transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-fin-text-muted">Net Surplus</p>
            <h3 className={`mt-2 text-2xl font-black tracking-tight ${
              balance >= 0 ? 'text-fin-primary' : 'text-fin-danger'
            }`}>
              {formatCurrency(balance)}
            </h3>
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors shadow-fin-sm ${
            balance >= 0 ? 'bg-fin-primary/15 text-fin-primary' : 'bg-fin-danger/15 text-fin-danger'
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              {balance < 0 ? (
                <path d="M12 3.25a.75.75 0 01.67.41l8 16a.75.75 0 01-.67 1.09H4a.75.75 0 01-.67-1.09l8-16a.75.75 0 01.67-.41zm0 4.5a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75zm0 9a.9.9 0 100 1.8.9.9 0 000-1.8z" />
              ) : (
                <path d="M6 6.25A2.25 2.25 0 018.25 4h7.5A2.25 2.25 0 0118 6.25v11.5A2.25 2.25 0 0115.75 20h-7.5A2.25 2.25 0 016 17.75V6.25zm3 3.5a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm0 3.5a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9z" />
              )}
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-[10px] text-fin-text-muted font-bold uppercase tracking-wider">
          <span className={`h-1.5 w-1.5 rounded-full mr-2 ${
            balance >= 0 ? 'bg-fin-primary' : 'bg-fin-danger'
          }`} />
          {balance >= 0 ? 'Net positive standing' : 'Budget warning active'}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SummaryCards
