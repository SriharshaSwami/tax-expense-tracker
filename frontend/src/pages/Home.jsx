import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const Home = () => {
  const { user } = (() => {
    try {
      return useAuth()
    } catch {
      return { user: null }
    }
  })()
  
  const { theme, toggleTheme } = useTheme()

  const features = [
    {
      title: 'Tax Slabs Audits',
      desc: 'Compare Old vs. New tax regimes for FY 2024-25 with strict budget revisions and discover optimized standard deductions.',
      icon: '📊',
      badge: 'Updated'
    },
    {
      title: 'AI Diagnostic Alerts',
      desc: 'Run advanced transaction aggregations and ML models to spot committed subscription streams and auto-renewals.',
      icon: '⚡',
      badge: 'ML Engine'
    },
    {
      title: 'Category Envelopes',
      desc: 'Cap monthly category limit outflows (e.g. food, bills, travel) and receive warning dashboard triggers.',
      icon: '🛡',
      badge: 'Proactive'
    },
    {
      title: 'Savings Milestones',
      desc: 'Establish timeline milestones for emergency funds or major purchases and accelerate progress with quick contribution presets.',
      icon: '🏆',
      badge: 'Accredited'
    }
  ]

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  }

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text-primary relative overflow-hidden transition-colors duration-300">
      {/* Background glowing particles */}
      <div className="absolute top-[-300px] right-[-150px] h-[700px] w-[700px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-200px] left-[-200px] h-[600px] w-[600px] rounded-full bg-indigo-500/3 dark:bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />

      {/* TOP HEADER PLATFORM NAVIGATION */}
      <nav className="w-full border-b border-fin-border bg-white/70 dark:bg-slate-900/30 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20">
              T
            </span>
            <span className="text-sm font-black uppercase tracking-wider text-fin-text-primary">
              TaxExpense
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme switcher button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-fin-border hover:bg-slate-100 dark:hover:bg-slate-800 text-fin-text-secondary hover:text-fin-text-primary transition duration-200 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="h-4.5 w-4.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.8 5.7a8.1 8.1 0 11-10.4-10.4 8.5 8.5 0 1010.4 10.4z" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs font-bold text-fin-text-secondary hover:text-fin-text-primary transition duration-200">
                  Sign In
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28 relative z-10 flex flex-col items-center justify-center text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-widest">
            🛡 PREMIUM WEALTH STRATEGY SUITE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-fin-text-primary tracking-tight leading-tight">
            Indian Taxes &amp; Spending Limits{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
              Unified in Real-Time
            </span>
          </h1>
          <p className="text-base text-fin-text-secondary max-w-xl mx-auto leading-relaxed">
            Audit FY 2024-25 regime structures, auto-detect recurring subscription channels, and secure your financial goals under one ambient digital workspace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="success" size="lg" className="px-8 shadow-fin-lg">
                  Launch Workspace
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="success" size="lg" className="px-8 shadow-fin-lg">
                    Build Free Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="px-8">
                    Access Portal
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* FEATURE SLABS GRID */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full pt-8"
        >
          {features.map((feat, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="p-6 text-left h-full flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">{feat.icon}</span>
                    <span className="text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 px-2 py-0.5 rounded-full tracking-wider">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-fin-text-primary tracking-tight">{feat.title}</h3>
                  <p className="text-xs text-fin-text-muted leading-relaxed">{feat.desc}</p>
                </div>
                <div className="pt-3 border-t border-fin-border">
                  <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    Configure Area
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-fin-border py-8 text-center text-xs text-fin-text-muted relative z-10">
        <p>© 2026 TaxExpense Planner. Overhauled with premium visual primitives and responsive dark/light models.</p>
      </footer>
    </div>
  )
}

export default Home
