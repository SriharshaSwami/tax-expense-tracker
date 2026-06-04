import React from 'react'

const InsightCard = ({ title, value, description, icon, color = 'emerald', loading, progress }) => {
  // Map color names to classes
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      iconBg: 'bg-fin-success/10 text-emerald-600 dark:text-emerald-400',
      progressBg: 'bg-emerald-100 dark:bg-emerald-500/15',
      progressBar: 'bg-emerald-500',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20',
      text: 'text-rose-700 dark:text-rose-400',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      progressBg: 'bg-rose-100 dark:bg-rose-500/15',
      progressBar: 'bg-rose-500',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20',
      text: 'text-indigo-700 dark:text-indigo-400',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      progressBg: 'bg-indigo-100 dark:bg-indigo-500/15',
      progressBar: 'bg-indigo-500',
    },
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20',
      text: 'text-teal-700 dark:text-teal-400',
      iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      progressBg: 'bg-teal-100 dark:bg-teal-500/15',
      progressBar: 'bg-teal-500',
    },
  }[color] || {
    bg: 'bg-slate-50 dark:bg-slate-500/10 border-slate-100 dark:border-slate-500/20',
    text: 'text-slate-700 dark:text-slate-400',
    iconBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    progressBg: 'bg-slate-100 dark:bg-slate-500/15',
    progressBar: 'bg-slate-500',
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-fin-border bg-fin-card p-5 shadow-xs animate-pulse flex flex-col justify-between h-full min-h-[10rem]">
        <div className="flex items-start justify-between">
          <div className="space-y-2.5 w-2/3">
            <div className="h-3.5 bg-fin-border rounded-md w-3/4" />
            <div className="h-6 bg-fin-border rounded-md w-1/2" />
          </div>
          <div className="h-10 w-10 bg-fin-border rounded-xl" />
        </div>
        <div className="space-y-1.5 mt-2">
          <div className="h-2.5 bg-fin-border rounded-md w-full" />
          <div className="h-2.5 bg-fin-border rounded-md w-5/6" />
        </div>
      </div>
    )
  }

  return (
    <div className={`insight-card rounded-2xl border border-fin-border bg-fin-card p-5 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between h-full min-h-[10rem]`}>
      <div className="flex items-start justify-between gap-4">
        <div className="overflow-hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-fin-text-muted">
            {title}
          </span>
          <h4 className="text-xl font-bold text-fin-text-primary tracking-tight mt-1 truncate">
            {value}
          </h4>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorStyles.iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4">
        {/* Progress Bar (Optional) */}
        {progress !== undefined && (
          <div className="mb-2">
            <div className="flex justify-between text-[10px] font-semibold text-fin-text-muted mb-1">
              <span>Savings Rate</span>
              <span>{progress}%</span>
            </div>
            <div className={`h-1.5 w-full rounded-full ${colorStyles.progressBg}`}>
              <div
                className={`h-1.5 rounded-full ${colorStyles.progressBar} transition-all duration-500`}
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          </div>
        )}

        <p
          className="text-xs text-fin-text-secondary leading-relaxed desc"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

export default InsightCard

