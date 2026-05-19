import React from 'react'

const AnalyticsHeader = ({ user, setMobileOpen, mobileOpen }) => {
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs">
      {/* Mobile Hamburguer Toggle */}
      <button
        type="button"
        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden cursor-pointer"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Page Context Banner */}
      <div className="hidden sm:block">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Workspace
        </span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-xs font-medium text-slate-500">Financial Analytics & Insights</span>
      </div>

      {/* Quick Metrics Widget */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-150 px-3 py-1 text-xs font-medium text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Tax Regime: <span className="font-bold uppercase text-slate-800">{user?.taxRegime}</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-150 px-3 py-1 text-xs font-medium text-slate-600">
          Base Salary: <span className="font-bold text-slate-800">₹{user?.salary?.toLocaleString('en-IN') || 0}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-655 hidden sm:inline">
            {user?.name}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-150">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AnalyticsHeader
