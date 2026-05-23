import React from 'react'

const InsightCard = ({ title, value, description, icon, color = 'emerald', loading, progress }) => {
  // Map color names to classes
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50 border-emerald-100',
      text: 'text-emerald-700',
      iconBg: 'bg-fin-success/10 text-emerald-600',
      progressBg: 'bg-emerald-100',
      progressBar: 'bg-emerald-500',
    },
    rose: {
      bg: 'bg-rose-50 border-rose-100',
      text: 'text-rose-700',
      iconBg: 'bg-rose-500/10 text-rose-600',
      progressBg: 'bg-rose-100',
      progressBar: 'bg-rose-500',
    },
    indigo: {
      bg: 'bg-indigo-50 border-indigo-100',
      text: 'text-indigo-700',
      iconBg: 'bg-indigo-500/10 text-indigo-600',
      progressBg: 'bg-indigo-100',
      progressBar: 'bg-indigo-500',
    },
    teal: {
      bg: 'bg-teal-50 border-teal-100',
      text: 'text-teal-700',
      iconBg: 'bg-teal-500/10 text-teal-600',
      progressBg: 'bg-teal-100',
      progressBar: 'bg-teal-500',
    },
  }[color] || {
    bg: 'bg-slate-50 border-slate-100',
    text: 'text-slate-700',
    iconBg: 'bg-slate-500/10 text-slate-600',
    progressBg: 'bg-slate-100',
    progressBar: 'bg-slate-500',
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs animate-pulse flex flex-col justify-between h-40">
        <div className="flex items-start justify-between">
          <div className="space-y-2.5 w-2/3">
            <div className="h-3.5 bg-slate-150 rounded-md w-3/4" />
            <div className="h-6 bg-slate-100 rounded-md w-1/2" />
          </div>
          <div className="h-10 w-10 bg-slate-150 rounded-xl" />
        </div>
        <div className="space-y-1.5 mt-2">
          <div className="h-2.5 bg-slate-100 rounded-md w-full" />
          <div className="h-2.5 bg-slate-100 rounded-md w-5/6" />
        </div>
      </div>
    )
  }

  return (
    <div className={`insight-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between h-40`}>
      <div className="flex items-start justify-between gap-4">
        <div className="overflow-hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <h4 className="text-xl font-bold text-slate-800 tracking-tight mt-1 truncate">
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
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
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
          className="text-xs text-slate-500 leading-relaxed desc"
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
