import React from 'react'
import Button from './Button'

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onActionClick,
  className = ''
}) => {
  return (
    <div
      className={`
        border border-dashed border-fin-border rounded-2xl bg-white/40 dark:bg-slate-900/20
        p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto
        ${className}
      `}
    >
      {/* Icon with glowing backdrop */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shadow-fin-sm relative">
        <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 animate-ping opacity-75" />
        {icon || (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
        )}
      </div>

      {/* Texts */}
      <div className="space-y-1.5">
        <h3 className="text-base font-bold tracking-tight text-fin-text-primary">
          {title}
        </h3>
        <p className="text-xs text-fin-text-secondary leading-relaxed max-w-sm">
          {description}
        </p>
      </div>

      {/* Button CTA */}
      {actionLabel && onActionClick && (
        <Button
          variant="primary"
          size="sm"
          onClick={onActionClick}
          className="mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
