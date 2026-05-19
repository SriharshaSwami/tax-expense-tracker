import React from 'react'
import { motion } from 'framer-motion'

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
        className="group relative overflow-hidden rounded-2xl border border-emerald-500/10 dark:border-emerald-500/15 bg-white/70 dark:bg-slate-900/40 p-6 shadow-fin-sm backdrop-blur-md transition-all duration-300"
      >
        <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-full bg-emerald-500/5 dark:bg-emerald-500/10 transition-all duration-300 group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-fin-text-muted">Total Income</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-emerald-650 dark:text-emerald-400">
              {formatCurrency(totalIncome)}
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="h-5.5 w-5.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-[10px] text-fin-text-muted font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />
          Live earnings ledger synced
        </div>
      </motion.div>

      {/* Total Expense Card */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, boxShadow: 'var(--shadow-fin-md)' }}
        className="group relative overflow-hidden rounded-2xl border border-rose-500/10 dark:border-rose-500/15 bg-white/70 dark:bg-slate-900/40 p-6 shadow-fin-sm backdrop-blur-md transition-all duration-300"
      >
        <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-full bg-rose-500/5 dark:bg-rose-500/10 transition-all duration-300 group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-fin-text-muted">Total Expense</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-rose-600 dark:text-rose-455">
              {formatCurrency(totalExpense)}
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 dark:text-rose-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="h-5.5 w-5.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 015.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94 2.28l-2.28 5.941"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-[10px] text-fin-text-muted font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-2" />
          Active outflows recorded
        </div>
      </motion.div>

      {/* Net Balance Card */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, boxShadow: 'var(--shadow-fin-md)' }}
        className={`group relative overflow-hidden rounded-2xl border p-6 shadow-fin-sm backdrop-blur-md transition-all duration-300 ${
          balance >= 0
            ? 'border-emerald-500/15 bg-gradient-to-br from-slate-900 to-emerald-950/60 dark:from-slate-950 dark:to-emerald-950/50 text-white'
            : 'border-rose-500/15 bg-gradient-to-br from-slate-900 to-rose-950/60 dark:from-slate-950 dark:to-rose-950/50 text-white'
        }`}
      >
        <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-full bg-white/5 transition-all duration-300 group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Surplus</p>
            <h3 className={`mt-2 text-2xl font-black tracking-tight ${
              balance >= 0 ? 'text-emerald-400' : 'text-rose-450'
            }`}>
              {formatCurrency(balance)}
            </h3>
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
            balance >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-5.5 w-5.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              {balance < 0 ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m-6-8h6"
                />
              )}
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-[10px] text-slate-405 font-bold uppercase tracking-wider">
          {balance >= 0 ? 'Net positive standing' : 'Budget warning active'}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SummaryCards
