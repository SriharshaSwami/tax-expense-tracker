import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import Card from './ui/Card'
import finPulseLogo from '../assets/finpulse-logo.png'

const AuthLayout = ({ title, subtitle, children, footerText, footerLink, footerLabel }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text-primary flex items-center justify-center relative overflow-hidden px-4 py-12 transition-colors duration-300">
      {/* Premium ambient glows */}
      <div className="absolute -top-50 -right-25 h-125 w-125 rounded-full bg-emerald-500/5 dark:bg-fin-success/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute -bottom-37.5 -left-37.5 h-100 w-100 rounded-full bg-indigo-500/5 dark:bg-indigo-500/8 blur-[100px] pointer-events-none z-0" />

      {/* FLOATING THEME SWITCHER TOGGLE */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 inline-flex h-7 w-12 items-center rounded-full border border-fin-border transition duration-200 cursor-pointer z-50 ${
          theme === 'dark' ? 'bg-fin-primary/70' : 'bg-fin-hover-bg'
        }`}
        aria-label="Switch Theme"
        role="switch"
        aria-checked={theme === 'dark'}
      >
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          }`}
        >
          {theme === 'dark' ? (
            <svg
              className="h-3.5 w-3.5 shrink-0 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              preserveAspectRatio="xMidYMid meet"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.8 5.7a8.1 8.1 0 11-10.4-10.4 8.5 8.5 0 1010.4 10.4z" />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5 shrink-0 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              preserveAspectRatio="xMidYMid meet"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </span>
      </button>

      {/* FORM WRAPPER PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="mb-8 text-center space-y-3">
          <Link
            to="/"
            className="inline-block hover:scale-105 transition-transform duration-200"
          >
            <img
              src={finPulseLogo}
              alt="FinPulse"
              className="h-15 md:h-17 w-auto mx-auto object-contain transition-all duration-300"
              style={{
                background: 'transparent',
                filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
              }}
            />
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
