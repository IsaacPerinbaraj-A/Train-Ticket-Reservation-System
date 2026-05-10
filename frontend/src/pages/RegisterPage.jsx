import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import Alert from "../components/Alert";
import Button from "../components/Button";
import InputField from "../components/InputField";

const initialForm = {
  name: "",
  email: "",
  password: ""
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email.";
  if (!/^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(form.password)) {
    errors.password = "Use 8+ characters with a number and special character.";
  }
  return errors;
}

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setMessage("");
    setErrorMessage("");

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await api.post("/register", form);
      setMessage(response.data.message);
      setForm(initialForm);
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_460px]">
        <section className="hidden bg-brand-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-brand-100">New Reservation Account</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Create your account and start booking in minutes.</h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-brand-50/90">
              Register once, verify the email from the backend console link, and move into the full search and booking flow.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 text-sm text-white/90">
              Strong password validation protects the login flow.
            </div>
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 text-sm text-white/90">
              Duplicate email registration is blocked automatically.
            </div>
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 text-sm text-white/90">
              Verification is simulated through a link printed in the backend terminal.
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <Link to="/" className="text-sm font-medium text-brand-600">
              Back to home
            </Link>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Create account</h2>
            <p className="mt-2 text-sm text-slate-500">Register, then verify your email from the backend console log.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <Alert type="success" message={message} />
              <Alert type="error" message={errorMessage} />
              <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
              <InputField label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
              <InputField
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />
              <Button className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-slate-600">
              Already registered?{" "}
              <Link className="font-medium text-brand-600" to="/login">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
