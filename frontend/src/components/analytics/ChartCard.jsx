import React from 'react'

const ChartCard = ({ title, subtitle, loading, children }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition duration-300 hover:shadow-md flex flex-col h-96">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Chart Body or Loading Skeleton */}
      <div className="flex-1 min-h-0 relative w-full flex items-center justify-center">
        {loading ? (
          <div className="w-full h-full flex flex-col justify-between animate-pulse px-2 py-4 space-y-4">
            {/* Grid Line Skeletons */}
            <div className="flex-1 w-full flex items-end justify-between space-x-4">
              <div className="bg-slate-100 rounded-lg w-full" style={{ height: '35%' }} />
              <div className="bg-slate-100 rounded-lg w-full" style={{ height: '70%' }} />
              <div className="bg-slate-100 rounded-lg w-full" style={{ height: '45%' }} />
              <div className="bg-slate-100 rounded-lg w-full" style={{ height: '80%' }} />
              <div className="bg-slate-100 rounded-lg w-full" style={{ height: '55%' }} />
              <div className="bg-slate-100 rounded-lg w-full" style={{ height: '90%' }} />
            </div>
            {/* Axis Skeleton */}
            <div className="h-4 bg-slate-100 rounded-md w-full" />
            {/* Legend Skeleton */}
            <div className="h-3 bg-slate-100 rounded-md w-1/3 mx-auto" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default ChartCard
