import React from 'react'
import { motion } from 'framer-motion'

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'success', 'danger', 'ghost', 'accent'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
  
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-650',
    secondary: 'border border-fin-border hover:bg-slate-50 text-fin-text-primary focus:ring-slate-400 dark:hover:bg-slate-800/50',
    success: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm focus:ring-teal-500 dark:bg-teal-500 dark:hover:bg-teal-600',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm focus:ring-rose-500',
    accent: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600',
    ghost: 'text-fin-text-secondary hover:bg-slate-50 focus:ring-slate-400 dark:hover:bg-slate-800/40'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}

export default Button
