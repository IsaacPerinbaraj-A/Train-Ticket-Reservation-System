export default function InputField({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500/20 ${
          error
            ? "border-rose-400 bg-rose-50"
            : "border-slate-300 bg-white focus:border-brand-500"
        }`}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
