function EmptyState({
  icon,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-overlay flex items-center justify-center mb-4 text-3xl">
        {icon || '📭'}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-xs mb-4">{description}</p>
      {action}
    </div>
  )
}

export default EmptyState
