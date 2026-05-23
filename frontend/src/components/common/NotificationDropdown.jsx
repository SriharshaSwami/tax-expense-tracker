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
    // Poll notifications - every 30 seconds in background, more frequently when dropdown is open
    const interval = setInterval(loadNotifications, isOpen ? 15000 : 30000)
    return () => clearInterval(interval)
  }, [isOpen])

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
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fin-warning/16 border border-fin-warning/25 text-fin-warning">
            ⚠️
          </div>
        )
      case 'goal_achievement':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fin-success/16 border border-fin-success/25 text-fin-success">
            🏆
          </div>
        )
      case 'spending_alert':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fin-danger/16 border border-fin-danger/25 text-fin-danger">
            💥
          </div>
        )
      case 'savings_milestone':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fin-info/16 border border-fin-info/25 text-fin-info">
            🌟
          </div>
        )
      default:
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fin-input-bg border border-fin-border text-fin-text-muted">
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
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-fin-input-bg border border-fin-border text-fin-text-secondary hover:text-fin-text-primary hover:bg-fin-hover-bg transition cursor-pointer"
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
            d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-fin-danger text-[9px] font-bold text-white border-2 border-fin-card animate-pulse">
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
            className="absolute right-0 mt-2.5 w-80 md:w-96 rounded-2xl border border-fin-border bg-fin-card/95 backdrop-blur-md p-4 shadow-fin-lg z-30"
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
                  className="text-[10px] font-bold text-fin-success hover:brightness-110 transition cursor-pointer"
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
                        ? 'border-fin-border bg-fin-card hover:bg-fin-card-hover'
                        : 'border-fin-success/25 bg-fin-success/10 hover:bg-fin-success/15'
                    }`}
                  >
                    {/* Active Indicator Pin */}
                    {!n.read && (
                      <span className="absolute top-3.5 left-3 h-1.5 w-1.5 rounded-full bg-fin-success" />
                    )}

                    {/* Left Icon */}
                    <div className={!n.read ? 'pl-2.5' : ''}>
                      {getAlertIcon(n.type)}
                    </div>

                    {/* Message Detail */}
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-fin-text-primary leading-tight">{n.title}</p>
                      <p className="mt-1 text-fin-text-secondary leading-relaxed wrap-break-word pr-4">
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
