import React from 'react'
import { motion } from 'framer-motion'
import NotificationDropdown from '../common/NotificationDropdown'
import { useTheme } from '../../context/ThemeContext'

const Header = ({ user, pageTitle, setMobileOpen, mobileOpen }) => {
  const { theme, toggleTheme } = useTheme()

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-fin-border bg-fin-card/95 backdrop-blur-md px-6 shadow-fin-sm">
      {/* Mobile Hamburguer Toggle */}
      <button
        type="button"
        className="rounded-lg p-2 text-fin-text-secondary hover:bg-fin-hover-bg md:hidden cursor-pointer"
        onClick={() => setMobileOpen && setMobileOpen(!mobileOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Page Context Banner & Global Search */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:block">
          <span className="text-[10px] font-bold uppercase tracking-widest text-fin-primary">
            Workspace
          </span>
          <span className="mx-2 text-fin-text-muted">/</span>
          <span className="text-xs font-semibold text-fin-text-secondary">{pageTitle || 'Finance Dashboard'}</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden lg:block w-64">
          <input
            type="text"
            placeholder="Search accounts, ledger..."
            className="w-full text-xs bg-fin-input-bg border border-fin-border rounded-xl pl-9 pr-4 py-1.5 outline-hidden transition focus:bg-fin-card focus:border-fin-primary focus:ring-2 focus:ring-fin-primary/20"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-fin-text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Metrics & Actions Widget */}
      <div className="flex items-center gap-4">
        {/* Tax Regime Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-fin-input-bg border border-fin-border px-3.5 py-1 text-[11px] font-bold text-fin-text-secondary">
          <span className="h-2 w-2 rounded-full bg-fin-success animate-pulse" />
          Tax Regime: <span className="text-fin-success font-extrabold uppercase">{user?.taxRegime || 'New'}</span>
        </div>

        {/* Base Salary Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-fin-input-bg border border-fin-border px-3.5 py-1 text-[11px] font-bold text-fin-text-secondary">
          Base Salary: <span className="text-fin-text-primary font-black">₹{user?.salary?.toLocaleString('en-IN') || 0}</span>
        </div>

        {/* Dynamic Dark/Light Theme Switching Toggle Switch */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ rotate: 45, scale: 0.95 }}
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-fin-input-bg border border-fin-border text-fin-text-secondary hover:text-fin-text-primary hover:bg-fin-hover-bg transition cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 text-fin-warning">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 text-fin-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </motion.button>

        {/* Live Notification Bell Alert Dropdown */}
        <NotificationDropdown />

        {/* Profile Avatar Initials */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-fin-text-secondary hidden sm:inline">
            {user?.name}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fin-badge-bg text-fin-badge-text font-extrabold text-xs border border-fin-border shadow-fin-sm">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
