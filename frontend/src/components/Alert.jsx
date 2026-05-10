export default function Alert({ type = "info", message }) {
  const tone = {
    info: "border-brand-200 bg-brand-50 text-brand-700",
    success: "border-accent-100 bg-accent-50 text-accent-700",
    error: "border-sunrise-100 bg-sunrise-50 text-sunrise-700"
  }[type];

  if (!message) return null;

  return <div className={`rounded-lg border px-4 py-3 text-sm ${tone}`}>{message}</div>;
}
