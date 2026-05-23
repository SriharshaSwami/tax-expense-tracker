import { cn } from '../utils/cn'

const shimmer = [
  'bg-gradient-to-r from-surface-raised via-surface-overlay to-surface-raised',
  'bg-[length:200%_100%]',
  'animate-shimmer',
].join(' ')

export function Skeleton({ className }) {
  return (
    <div className={cn('rounded-md', shimmer, className)} />
  )
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/5' : 'w-full')}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn(
      'p-5 rounded-2xl bg-surface-raised border border-surface-border space-y-3',
      className,
    )}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-4 px-4 py-2">
        {[40, 20, 20, 20].map((w, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${w}%` }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-t border-surface-border">
          {[40, 20, 20, 20].map((w, j) => (
            <Skeleton key={j} className="h-4" style={{ width: `${w}%` }} />
          ))}
        </div>
      ))}
    </div>
  )
}
