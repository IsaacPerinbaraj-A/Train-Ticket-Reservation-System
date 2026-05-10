const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border border-stone-300 bg-white text-slate-700 hover:bg-stone-50",
  danger: "bg-sunrise-600 text-white hover:bg-sunrise-700"
};

export function getButtonClasses(variant = "primary", className = "") {
  return `inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`.trim();
}

export default function Button({
  children,
  className = "",
  disabled = false,
  variant = "primary",
  ...props
}) {

  return (
    <button
      className={getButtonClasses(variant, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
