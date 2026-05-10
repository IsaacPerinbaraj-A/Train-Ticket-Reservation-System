import { Link } from "react-router-dom";
import { getButtonClasses } from "../components/Button";
import { useAuth } from "../context/AuthContext";

const highlights = [
  {
    title: "Search with clarity",
    text: "Find trains by route and date, then narrow results with time, class, and live seat availability."
  },
  {
    title: "Book with confidence",
    text: "Choose a seat manually or let the system auto-assign one while preventing duplicate or conflicting bookings."
  },
  {
    title: "Track changes easily",
    text: "Review bookings, cancel tickets, check refund percentages, and raise support requests from one place."
  }
];

const steps = [
  "Create an account and verify your email.",
  "Search trains by source, destination, and travel date.",
  "Pick a seat or use auto allocation to confirm your booking.",
  "Manage cancellations, refunds, and support tickets from your dashboard."
];

const featureList = [
  "JWT-based login with remember me support",
  "Live in-memory train and seat availability",
  "Manual and automatic seat allocation",
  "Refund rules based on journey timing",
  "Support ticket tracking and notification logs",
  "Clean dashboard for search, booking, and account actions"
];

export default function LandingPage() {
  const { authenticated } = useAuth();
  const primaryLinkClass = getButtonClasses("primary", "px-6 py-3");
  const ghostLinkClass = getButtonClasses(
    "secondary",
    "border-white/30 bg-white/10 px-6 py-3 text-white hover:bg-white/20"
  );

  return (
    <div className="bg-[linear-gradient(180deg,_#fffdf8_0%,_#fff8ef_38%,_#ffffff_100%)] text-slate-900">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-base font-semibold text-white">
            Train Ticket Reservation
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/login" className={ghostLinkClass}>
              Login
            </Link>
            <Link to={authenticated ? "/dashboard" : "/register"} className={primaryLinkClass}>
              {authenticated ? "Open Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80"
          alt="Train approaching a station platform"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/60" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl items-end px-4 pb-24 pt-32">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase text-amber-200">Online Reservation Platform</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              Train Ticket Reservation
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 md:text-lg">
              Search trains, check availability, book seats, manage cancellations, and follow refund status from a
              simple full-stack reservation system.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={authenticated ? "/dashboard" : "/register"} className={primaryLinkClass}>
                {authenticated ? "Go to Dashboard" : "Create an Account"}
              </Link>
              <Link to="/login" className={ghostLinkClass}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-lg border border-stone-200 bg-white/95 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase text-accent-600">How It Works</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">A clearer path from search to confirmed ticket</h2>
            <div className="mt-8 space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-lg border border-stone-200 bg-white/80 p-4 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-6 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-[linear-gradient(180deg,_#fff8ef_0%,_#ffffff_100%)] p-6 shadow-sm">
            <p className="text-sm font-medium uppercase text-plum-600">What Users Get</p>
            <ul className="mt-5 space-y-3">
              {featureList.map((feature) => (
                <li key={feature} className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-slate-700">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-[linear-gradient(180deg,_#f7fffd_0%,_#fffdf8_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase text-brand-600">Built For Real Flows</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Users can understand the system before they ever log in</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The experience is designed to make the core journey obvious: account creation, train discovery, seat
              selection, booking confirmation, cancellation, refund tracking, and support.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-accent-600">Search</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Route and availability</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Filter trains by source, destination, date, time bucket, class, and seat availability.
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-brand-600">Booking</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Seat-safe reservations</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Book manually or automatically with protection against repeated clicks and double booking.
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-plum-600">Aftercare</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Refunds and support</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Cancel tickets, review refund percentages, and raise support tickets inside the same app.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-lg bg-[linear-gradient(135deg,_#0f172a_0%,_#115e59_55%,_#7c2d12_100%)] px-6 py-10 md:px-10 shadow-lg">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase text-amber-200">Ready To Explore</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Start with the landing page, continue with the full reservation flow</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                New users can understand the product here, then move straight into registration or sign in to manage
                their bookings.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={authenticated ? "/dashboard" : "/register"} className={primaryLinkClass}>
                {authenticated ? "Open Dashboard" : "Register Now"}
              </Link>
              <Link to="/login" className={getButtonClasses("secondary", "px-6 py-3")}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
