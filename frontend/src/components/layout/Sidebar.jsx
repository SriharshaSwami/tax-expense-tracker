import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import finPulseLogo from '../../assets/finpulse-logo.png'

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  
  // Collapse state persisted in localstorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed)
  }, [isCollapsed])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (err) {
      toast.error('Logout failed')
    } finally {
      setLoggingOut(false)
    }
  }

  const isActive = (path) => location.pathname === path

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      )
    },
    {
      path: '/ai-insights',
      label: 'AI Insights',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.43m-8.904-.666L2.25 12l8.904-4.43m0 8.334l8.905 4.43L12 12l8.905-4.43M12 12V3" />
        </svg>
      )
    },
    {
      path: '/budgets',
      label: 'Budgets',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
        </svg>
      )
    },
    {
      path: '/savings-goals',
      label: 'Savings Goals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      path: '/tax-calculator',
      label: 'Tax Calculator',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6M9 12h6M9 16h2M13 16h2" />
        </svg>
      )
    }
  ]

  // Nav indicator container styles
  const sidebarWidth = isCollapsed ? 'md:w-20' : 'md:w-66'

  return (
    <>
      {/* MOBILE DRAWER SHEET */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="sidebar-surface fixed top-0 left-0 z-40 h-screen w-64 border-r border-fin-border/20 bg-fin-sidebar-bg text-fin-sidebar-text p-6 flex flex-col justify-between md:hidden shadow-fin-lg"
          >
            <div>
              <div className="flex items-center border-b border-fin-border/15 pb-5">
                <img 
                  src={finPulseLogo} 
                  alt="FinPulse" 
                  className="h-9 w-auto max-w-none"
                  style={{ objectFit: 'contain', background: 'transparent', filter: 'brightness(0) invert(1)' }}
                />
              </div>

              <nav className="mt-8 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={`relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive(item.path)
                        ? 'text-white'
                        : 'text-fin-sidebar-subtle hover:text-white hover:bg-white/8'
                    }`}
                  >
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="mobileActiveIndicator"
                        className="absolute inset-0 bg-fin-primary rounded-xl"
                      />
                    )}
                    <span className="relative z-10 shrink-0">{item.icon}</span>
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Logout button in Mobile View */}
            <div className="border-t border-fin-border/15 pt-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white font-bold border border-fin-border/20">
                  {getInitials(user?.name)}
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-xs font-bold text-white">{user?.name}</p>
                  <p className="truncate text-[10px] text-fin-sidebar-subtle">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-fin-border/20 py-2.5 text-xs font-semibold text-fin-sidebar-subtle hover:text-white hover:bg-white/8 transition disabled:opacity-60 cursor-pointer shadow-fin-sm"
              >
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside
        className={`
          hidden md:flex h-screen sticky top-0 left-0 z-40 border-r border-fin-border/10 sidebar-surface bg-fin-sidebar-bg text-fin-sidebar-text
          flex-col justify-between p-5 transition-all duration-300 ease-in-out shrink-0 ${sidebarWidth}
        `}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center border-b border-fin-border/15 pb-5 overflow-hidden">
            <img 
              src={finPulseLogo} 
              alt="FinPulse" 
              className={`h-12 max-w-none transition-all duration-300 ${isCollapsed ? 'w-13 object-cover' : 'w-auto'}`}
              style={{ objectFit: 'contain', background: 'transparent', filter: 'brightness(0) invert(1)' }}
            />
          </div>

          {/* Navigation Items */}
          <nav className="mt-8 space-y-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center rounded-xl py-3 text-sm font-semibold transition ${
                  isCollapsed ? 'justify-center px-0' : 'px-4 gap-3.5'
                } ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-fin-sidebar-subtle hover:text-white hover:bg-white/8'
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="desktopActiveIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-fin-primary rounded-xl"
                  />
                )}
                
                <span className="relative z-10 shrink-0">{item.icon}</span>
                
                {!isCollapsed ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                ) : (
                  /* Animated tooltip when collapsed */
                  <div className="absolute left-16 z-50 rounded-lg bg-fin-card text-fin-text-primary px-2 py-1 text-[11px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition duration-200 shadow-fin-md whitespace-nowrap scale-95 group-hover:scale-100 origin-left border border-fin-border">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* User profile & Collapse Button */}
        <div className="border-t border-fin-border/15 pt-5 space-y-4">
          {/* User info details */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} overflow-hidden`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white font-bold border border-fin-border/15 shadow-fin-sm">
              {getInitials(user?.name)}
            </div>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                <p className="truncate text-xs font-bold text-white">{user?.name}</p>
                <p className="truncate text-[10px] text-fin-sidebar-subtle">{user?.email}</p>
              </motion.div>
            )}
          </div>

          {/* Action row (Sign out, Collapse toggle) */}
          <div className="flex flex-col gap-2">
            {!isCollapsed ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-fin-border/20 py-2 text-xs font-semibold text-fin-sidebar-subtle hover:text-white hover:bg-white/8 transition disabled:opacity-60 cursor-pointer shadow-fin-sm"
              >
                {loggingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="group relative flex justify-center items-center rounded-xl border border-fin-border/20 py-2.5 text-fin-sidebar-subtle hover:text-white hover:bg-white/8 transition cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <div className="absolute left-16 z-50 rounded-lg bg-fin-card text-fin-text-primary px-2 py-1 text-[11px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition duration-200 shadow-fin-md whitespace-nowrap scale-95 group-hover:scale-100 origin-left border border-fin-border">
                  Sign Out
                </div>
              </button>
            )}

            {/* Collapse toggle trigger arrow */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center rounded-xl border border-fin-border/20 py-2 text-fin-sidebar-subtle hover:text-white hover:bg-white/8 transition cursor-pointer shadow-fin-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
