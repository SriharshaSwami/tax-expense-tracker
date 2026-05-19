import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTransactions } from '../context/TransactionContext'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import SummaryCards from '../components/dashboard/SummaryCards'
import TransactionForm from '../components/dashboard/TransactionForm'
import TransactionList from '../components/dashboard/TransactionList'

const Dashboard = () => {
  const { user } = useAuth()
  const { summary, loading } = useTransactions()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  }

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text-primary flex flex-col md:flex-row relative overflow-hidden">
      {/* Premium ambient light background */}
      <div className="absolute top-[-250px] right-[-150px] h-[600px] w-[600px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-150px] left-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-500/3 dark:bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />

      {/* 1. SIDEBAR layout */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* MOBILE OVERLAY BACKGROUND */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-35 bg-slate-950/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 2. MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* TOP NAVBAR */}
        <Header
          user={user}
          pageTitle="Ledger Overview"
          setMobileOpen={setMobileMenuOpen}
          mobileOpen={mobileMenuOpen}
        />

        {/* MAIN BODY AREA */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 no-scrollbar"
        >
          {/* Welcome Title */}
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-fin-text-primary tracking-tight">
              Ledger Workspace
            </h1>
            <p className="text-xs text-fin-text-muted leading-relaxed">
              Welcome back, <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{user?.name}</span>! Audit your earnings, expenditures, and net balance in real-time.
            </p>
          </div>

          {/* SUMMARY CARDS METRICS */}
          <SummaryCards summary={summary} loading={loading} />

          {/* TRANSACTION WORKSPACE GRID */}
          <div className="grid gap-8 lg:grid-cols-3 items-start">
            {/* Form Column */}
            <div className="lg:col-span-1">
              <TransactionForm />
            </div>

            {/* List and Filters Column */}
            <div className="lg:col-span-2">
              <TransactionList />
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  )
}

export default Dashboard
