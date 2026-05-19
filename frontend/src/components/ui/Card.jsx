import React from 'react'
import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hoverable = true,
  onClick,
  glow = false,
  ...props
}) => {
  const isClickable = !!onClick

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverable && !onClick ? { y: -2, boxShadow: 'var(--shadow-fin-md)' } : isClickable ? { scale: 1.01, y: -2, boxShadow: 'var(--shadow-fin-md)' } : {}}
      whileTap={isClickable ? { scale: 0.99 } : {}}
      className={`
        glass-panel rounded-2xl p-6 shadow-fin-sm transition duration-300
        ${glow ? 'shadow-fin-glow border-emerald-500/20' : ''}
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
