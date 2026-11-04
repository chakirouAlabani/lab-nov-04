function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white/70 p-8 text-center text-stone-600">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 text-sm">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
