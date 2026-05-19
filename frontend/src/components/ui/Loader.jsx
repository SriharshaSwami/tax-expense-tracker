import React from 'react'
import { motion } from 'framer-motion'

// Elegant spinning circle loader
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  }

  return (
    <div className={`animate-spin rounded-full border-emerald-500 border-t-transparent ${sizes[size]} ${className}`} />
  )
}

// Skeleton loading layout primitive
export const Skeleton = ({
  height = 'h-4',
  width = 'w-full',
  circle = false,
  className = ''
}) => {
  return (
    <div
      className={`
        animate-pulse bg-slate-200/80 dark:bg-slate-800/80
        ${circle ? 'rounded-full' : 'rounded-xl'}
        ${height} ${width} ${className}
      `}
    />
  )
}

// Full page loader transition overlay
export const FullPageLoader = ({ label = 'Aggregating financial ledger...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-fin-bg p-4"
    >
      <Spinner size="lg" className="mb-4" />
      <motion.p
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
        className="text-sm font-semibold text-fin-text-secondary tracking-tight"
      >
        {label}
      </motion.p>
    </motion.div>
  )
}

// Visual pre-built Card loader skeleton
export const CardSkeleton = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 shadow-fin-sm space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton height="h-10" width="w-10" circle />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-4" width="w-1/3" />
          <Skeleton height="h-3" width="w-1/2" />
        </div>
      </div>
      <div className="space-y-2.5 pt-4">
        <Skeleton height="h-6" width="w-full" />
        <Skeleton height="h-4" width="w-5/6" />
        <Skeleton height="h-4" width="w-2/3" />
      </div>
    </div>
  )
}

const Loader = {
  Spinner,
  Skeleton,
  FullPageLoader,
  CardSkeleton
}

export default Loader
