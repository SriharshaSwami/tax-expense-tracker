import React from 'react'

const SectionHeader = ({
  title,
  subtitle,
  actions,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ${className}`}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-fin-text-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-fin-text-muted leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

export default SectionHeader
