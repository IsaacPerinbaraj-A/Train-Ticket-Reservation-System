import { useEffect, useState } from "react";
import api from "../api/client";
import Alert from "../components/Alert";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";

const supportSuggestions = [
  "Refund issue",
  "Seat selection problem",
  "Login help",
  "Booking confirmation"
];

export default function SupportPage() {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    try {
      const response = await api.get(`/support/${user.id}`);
      setTickets(response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to load support tickets.");
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const response = await api.post("/support", { subject, message });
      setTickets((current) => [response.data.ticket, ...current]);
      setStatusMessage(response.data.message);
      setSubject("");
      setMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to create support ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-stone-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#faf5ff_40%,_#f0fdfa_100%)] p-6 shadow-sm">
        <p className="text-sm font-medium uppercase text-plum-600">Support Center</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Help users solve booking and refund issues quickly</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Create a support request, review ticket history, and keep issue tracking in the same workflow as reservations.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-xl border border-stone-200 bg-white/95 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Support request</h2>
          <p className="mt-1 text-sm text-slate-500">Share booking or refund issues and we will log them in memory.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {supportSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSubject(item)}
                className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-plum-200 hover:bg-plum-50 hover:text-plum-700"
              >
                {item}
              </button>
            ))}
          </div>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <Alert type="success" message={statusMessage} />
            <Alert type="error" message={errorMessage} />
            <InputField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Message</span>
              <textarea
                className="min-h-32 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-plum-500 focus-visible:ring-2 focus-visible:ring-plum-500/20"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            <Button disabled={loading || !subject.trim() || !message.trim()}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white/95 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Support tickets</h2>
          <div className="mt-5 space-y-3">
            {tickets.length === 0 ? (
              <div className="rounded-lg border border-dashed border-stone-200 bg-stone-50 p-5 text-sm text-slate-500">
                No support tickets yet. Submit a request to start tracking support activity here.
              </div>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-lg border border-stone-200 bg-stone-50/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{ticket.subject}</p>
                    <span className="rounded-full bg-plum-50 px-3 py-1 text-xs font-medium text-plum-700">{ticket.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{ticket.message}</p>
                  <p className="mt-2 text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
