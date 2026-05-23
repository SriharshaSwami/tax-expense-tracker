import React from 'react'

const Select = React.forwardRef(({
  label,
  id,
  options = [],
  error,
  helperText,
  className = '',
  children,
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
      <div className="relative">
        <select
          id={id}
          ref={ref}
          className={`
            w-full appearance-none rounded-xl border bg-fin-input-bg px-4 py-2.5 text-sm text-fin-text-primary outline-hidden
            transition duration-150 focus:bg-fin-card focus:ring-2 focus:ring-fin-primary/20
            cursor-pointer pr-10
            ${error 
              ? 'border-fin-danger focus:border-fin-danger focus:ring-fin-danger/20' 
              : 'border-fin-border focus:border-fin-primary'
            }
            ${className}
          `}
          {...props}
        >
          {children || options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-fin-card text-fin-text-primary">
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* custom arrow indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-fin-text-muted">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
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

Select.displayName = 'Select'

export default Select
