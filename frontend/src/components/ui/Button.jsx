import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const variants = {
  primary:   'bg-fin-primary-dark hover:bg-fin-primary text-white shadow-fin-sm hover:shadow-fin-glow',
  secondary: 'bg-fin-card-hover hover:bg-fin-card text-fin-text-primary border border-fin-border',
  danger:    'bg-red-500 hover:bg-red-600 text-white',
  ghost:     'hover:bg-fin-card-hover text-fin-text-secondary hover:text-fin-text-primary',
  outline:   'border border-fin-primary text-fin-primary hover:bg-fin-primary hover:text-white',
}

const sizes = {
  sm:  'px-3 py-1.5 text-xs rounded-md',
  md:  'px-4 py-2.5 text-sm rounded-lg',
  lg:  'px-6 py-3 text-base rounded-xl',
}

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  leftIcon,
  rightIcon,
  ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={cn(
      'inline-flex items-center justify-center gap-2 font-medium',
      'transition-all duration-150 active:scale-[0.98]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fin-primary focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  >
    {loading ? (
      <>
        <svg
          className="animate-spin w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span>Loading…</span>
      </>
    ) : (
      <>
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </>
    )}
  </button>
))

Button.displayName = 'Button'
export default Button
