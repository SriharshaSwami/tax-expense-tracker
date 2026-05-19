const LoadingSpinner = ({ fullScreen = false }) => {
  const wrapperClass = fullScreen
    ? 'flex min-h-screen items-center justify-center bg-slate-50'
    : 'flex justify-center py-8'

  return (
    <div className={wrapperClass}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
    </div>
  )
}

export default LoadingSpinner
