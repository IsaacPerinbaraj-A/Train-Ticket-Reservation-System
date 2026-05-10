import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/bookings", label: "My Bookings" },
  { to: "/support", label: "Support" }
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.09),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.10),_transparent_26%),linear-gradient(180deg,_#fffdf8_0%,_#f6f6f1_100%)]">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-slate-900">Train Ticket Reservation</h1>
            <p className="text-sm text-slate-600">Book seats, track refunds, and manage support.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 text-left sm:text-right">
              <p className="text-sm font-medium text-slate-700">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <Button variant="secondary" className="sm:self-auto" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-stone-200 bg-white/90 p-3 shadow-sm lg:sticky lg:top-24 lg:h-fit">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-brand-50 to-accent-50 text-slate-900"
                      : "text-slate-600 hover:bg-stone-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
