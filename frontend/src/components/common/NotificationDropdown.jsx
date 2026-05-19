import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../../services/notificationService'
import toast from 'react-hot-toast'

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const loadNotifications = async () => {
    try {
      const res = await fetchNotifications()
      if (res.success) {
        setNotifications(res.notifications)
      }
    } catch (err) {
      console.error('[Load Notifications Error]:', err)
    }
  }

  useEffect(() => {
    loadNotifications()
    // Poll notifications every 10 seconds to keep alerts live in dashboard
    const interval = setInterval(loadNotifications, 10000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllNotificationsRead()
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        toast.success('All alerts marked as read')
      }
    } catch (err) {
      toast.error('Failed to update notifications')
    }
  }

  const handleMarkSingleRead = async (id) => {
    try {
      const res = await markNotificationRead(id)
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    try {
      const res = await deleteNotification(id)
      if (res.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id))
        toast.success('Notification cleared')
      }
    } catch (err) {
      toast.error('Could not clear notification')
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'budget_warning':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-amber-500">
            ⚠️
          </div>
        )
      case 'goal_achievement':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-405">
            🏆
          </div>
        )
      case 'spending_alert':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 text-rose-500">
            💥
          </div>
        )
      case 'savings_milestone':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-blue-500">
            🌟
          </div>
        )
      default:
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500">
            🔔
          </div>
        )
    }
  }

  const formatTime = (dateStr) => {
    const diff = new Date() - new Date(dateStr)
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)

    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-fin-border dark:border-slate-800 text-fin-text-secondary hover:text-fin-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a9.04 9.04 0 01-1.697 0m-7.24 0a44.405 44.405 0 011.697-9.492c.29-1.948 1.93-3.541 3.97-3.541a4.002 4.002 0 027.753 0c2.04 0 3.68 1.593 3.97 3.541a44.405 44.405 0 011.697 9.492m-12.73 0c-.318-.007-.65-.015-.99-.025m12.73 0c.318-.007.65-.015.99-.025m-12.73 0a15.933 15.933 0 011.697-9.492M14.857 17.082a9.04 9.04 0 01-1.697 0"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white border-2 border-white dark:border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Glassmorphic Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2.5 w-80 md:w-96 rounded-2xl border border-fin-border dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-4 shadow-fin-lg z-30"
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between pb-3 border-b border-fin-border">
              <div>
                <h4 className="text-sm font-bold text-fin-text-primary">Alert Center</h4>
                {unreadCount > 0 && (
                  <p className="text-[10px] text-fin-text-muted font-semibold mt-0.5">
                    You have {unreadCount} unread system notifications
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 hover:text-emerald-700 transition cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List Content */}
            <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleMarkSingleRead(n._id)}
                    className={`relative flex items-start gap-3 rounded-xl border p-3 transition cursor-pointer ${
                      n.read
                        ? 'border-fin-border dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                        : 'border-emerald-100 dark:border-emerald-950 bg-emerald-500/5 dark:bg-emerald-500/10 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15'
                    }`}
                  >
                    {/* Active Indicator Pin */}
                    {!n.read && (
                      <span className="absolute top-3.5 left-3 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    )}

                    {/* Left Icon */}
                    <div className={!n.read ? 'pl-2.5' : ''}>
                      {getAlertIcon(n.type)}
                    </div>

                    {/* Message Detail */}
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-fin-text-primary leading-tight">{n.title}</p>
                      <p className="mt-1 text-fin-text-secondary leading-relaxed break-words pr-4">
                        {n.message}
                      </p>
                      <span className="text-[9px] font-semibold text-fin-text-muted block mt-1.5">
                        {formatTime(n.createdAt)}
                      </span>
                    </div>

                    {/* Clear Alert Trigger */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, n._id)}
                      className="text-fin-text-muted hover:text-rose-500 dark:hover:text-rose-400 transition p-1 cursor-pointer shrink-0"
                      title="Dismiss alert"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-fin-text-muted">
                  <span className="text-2xl block mb-1">📭</span>
                  <p className="text-xs font-semibold text-fin-text-primary">No recent notifications</p>
                  <p className="text-[10px] text-fin-text-muted mt-0.5">Your accounts are currently fully optimized!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationDropdown
