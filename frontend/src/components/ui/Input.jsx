import React from 'react'

const Input = React.forwardRef(({
  label,
  id,
  type = 'text',
  error,
  helperText,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-fin-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        className={`
          w-full rounded-xl border bg-slate-50/50 px-4 py-2.5 text-sm text-fin-text-primary outline-hidden
          transition duration-150 focus:bg-white dark:focus:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500/20
          dark:bg-slate-900/30
          ${error 
            ? 'border-rose-450 focus:border-rose-500' 
            : 'border-fin-border focus:border-emerald-500 dark:border-slate-800'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1 animate-pulse">
          <span>⚠️</span> {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-[10px] text-fin-text-muted mt-1 leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
