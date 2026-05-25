import React from 'react'

const Input = React.forwardRef(({
  label,
  id,
  type = 'text',
  error,
  helperText,
  className = '',
  onInfoClick,
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase tracking-wider text-fin-text-secondary"
          >
            {label}
          </label>
          {onInfoClick && (
            <button
              type="button"
              onClick={onInfoClick}
              className="text-fin-text-muted hover:text-fin-primary transition-colors cursor-pointer focus:outline-none"
              title="What is this?"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        className={`
          w-full rounded-xl border bg-fin-input-bg px-4 py-2.5 text-sm text-fin-text-primary outline-hidden
          transition duration-150 focus:bg-fin-card focus:ring-2 focus:ring-fin-primary/20
          ${error 
            ? 'border-fin-danger focus:border-fin-danger focus:ring-fin-danger/20' 
            : 'border-fin-border focus:border-fin-primary'
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
