function AlertMessage({ type = 'info', title, message }) {
  const styles = {
    success: 'border-emerald-600/20 bg-emerald-50 text-emerald-900',
    error: 'border-rose-600/20 bg-rose-50 text-rose-900',
    info: 'border-amber-500/25 bg-amber-50 text-amber-900',
  };

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type] || styles.info}`}>
      {title ? <p className="font-semibold">{title}</p> : null}
      {message ? <p className="mt-1">{message}</p> : null}
    </div>
  );
}

export default AlertMessage;
