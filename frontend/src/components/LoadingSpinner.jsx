function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-600 shadow-sm">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-emerald-600" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
