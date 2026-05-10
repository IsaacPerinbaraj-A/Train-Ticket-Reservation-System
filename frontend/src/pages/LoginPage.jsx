import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";

function validate(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = "Email is required.";
  if (!form.password.trim()) errors.password = "Password is required.";
  return errors;
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setErrorMessage("");

    if (Object.keys(nextErrors).length > 0) return;

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_460px]">
        <section className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-sky-200">Welcome Back</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Manage train bookings without confusion.</h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              Sign in to search trains, reserve seats, track refunds, and manage support requests from one place.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              Search by route, date, class, and availability.
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              Confirm seats with manual selection or auto allocation.
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              Review bookings, refunds, and support activity anytime.
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <Link to="/" className="text-sm font-medium text-brand-600">
              Back to home
            </Link>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to search trains and manage reservations.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <Alert type="error" message={errorMessage} />
              <InputField label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
              <InputField
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-brand-600"
                />
                Remember Me
              </label>
              <Button className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-slate-600">
              Need an account?{" "}
              <Link className="font-medium text-brand-600" to="/register">
                Register
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
