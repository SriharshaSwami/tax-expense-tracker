import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import Card from './ui/Card'

const AuthLayout = ({ title, subtitle, children, footerText, footerLink, footerLabel }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text-primary flex items-center justify-center relative overflow-hidden px-4 py-12 transition-colors duration-300">
      {/* Premium ambient glows */}
      <div className="absolute top-[-200px] right-[-100px] h-[500px] w-[500px] rounded-full bg-emerald-500/5 dark:bg-fin-success/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-150px] left-[-150px] h-[400px] w-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/8 blur-[100px] pointer-events-none z-0" />

      {/* FLOATING THEME SWITCHER TOGGLE */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-xl border border-fin-border bg-slate-50/50 dark:bg-slate-900/30 text-fin-text-secondary hover:text-fin-text-primary hover:border-slate-400 dark:hover:border-slate-700 transition duration-300 shadow-fin-sm cursor-pointer z-50 flex items-center justify-center"
        aria-label="Switch Theme"
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          {theme === 'dark' ? (
            <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.8 5.7a8.1 8.1 0 11-10.4-10.4 8.5 8.5 0 1010.4 10.4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </motion.div>
      </button>

      {/* FORM WRAPPER PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="mb-8 text-center space-y-2">
          <Link
            to="/"
            className="inline-block text-xs font-black uppercase tracking-widest text-fin-success bg-fin-success/10 px-3 py-1 rounded-full hover:scale-102 transition duration-200"
          >
            TaxExpense Planner
          </Link>
          <h1 className="text-3xl font-black text-fin-text-primary tracking-tight">{title}</h1>
          <p className="text-xs text-fin-text-secondary leading-relaxed">{subtitle}</p>
        </div>

        <Card hoverable={false} className="glass-panel p-8 shadow-fin-lg">
          {children}
        </Card>

        <p className="mt-6 text-center text-xs text-fin-text-secondary">
          {footerText}{' '}
          <Link
            to={footerLink}
            className="font-extrabold text-emerald-650 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-350 underline transition duration-200"
          >
            {footerLabel}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default AuthLayout
