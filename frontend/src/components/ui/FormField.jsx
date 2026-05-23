import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

/**
 * FormField — a drop-in wrapper for react-hook-form `register()`.
 * Accepts all native <input> / <select> props plus:
 *   label, error (string), helperText, leftIcon
 */
export const FormField = forwardRef(({
  label,
  id,
  type = 'text',
  error,
  helperText,
  leftIcon,
  className,
  as: Tag = 'input',
  children,
  ...props
}, ref) => (
  <div className="w-full space-y-1.5">
    {label && (
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary"
      >
        {label}
      </label>
    )}

    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fin-text-muted pointer-events-none">
          {leftIcon}
        </span>
      )}

      {Tag === 'select' ? (
        <select
          id={id}
          ref={ref}
          className={cn(
            'w-full rounded-xl border bg-fin-input-bg px-4 py-2.5 text-sm text-fin-text-primary',
            'outline-none transition duration-150',
            'focus:bg-fin-card focus:ring-2',
            error
              ? 'border-fin-danger focus:border-fin-danger focus:ring-fin-danger/20'
              : 'border-fin-border focus:border-fin-primary focus:ring-fin-primary/20',
            leftIcon && 'pl-10',
            className,
          )}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          ref={ref}
          type={type}
          className={cn(
            'w-full rounded-xl border bg-fin-input-bg px-4 py-2.5 text-sm text-fin-text-primary',
            'outline-none transition duration-150',
            'focus:bg-fin-card focus:ring-2',
            error
              ? 'border-fin-danger focus:border-fin-danger focus:ring-fin-danger/20'
              : 'border-fin-border focus:border-fin-primary focus:ring-fin-primary/20',
            leftIcon && 'pl-10',
            className,
          )}
          {...props}
        />
      )}
    </div>

    {error && (
      <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
        <span aria-hidden>⚠</span> {error}
      </p>
    )}
    {!error && helperText && (
      <p className="text-[10px] text-fin-text-muted mt-1 leading-relaxed">{helperText}</p>
    )}
  </div>
))

FormField.displayName = 'FormField'
export default FormField
