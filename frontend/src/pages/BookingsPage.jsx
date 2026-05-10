import { useEffect, useState } from "react";
import api from "../api/client";
import Alert from "../components/Alert";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [refunds, setRefunds] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get("/bookings");
        setBookings(response.data);
      } catch (error) {
        setErrorMessage("Unable to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user.id]);

  const persistBookingId = (id) => {
    const storage = localStorage.getItem("train_token") ? localStorage : sessionStorage;
    storage.setItem(`booking_${id}`, JSON.stringify(id));
  };

  const handleCancel = async (id) => {
    try {
      const response = await api.post(`/cancel/${id}`);
      setBookings((current) => current.map((booking) => (booking.id === id ? response.data.booking : booking)));
      const refund = await api.get(`/refund/${id}`);
      setRefunds((current) => ({ ...current, [id]: refund.data }));
      persistBookingId(id);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Cancellation failed.");
    }
  };

  const handleRefundCheck = async (id) => {
    try {
      const response = await api.get(`/refund/${id}`);
      setRefunds((current) => ({ ...current, [id]: response.data }));
      persistBookingId(id);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to fetch refund.");
    }
  };

  if (loading) {
    return <div className="rounded-xl border border-stone-200 bg-white/95 p-6 text-sm text-slate-500 shadow-sm">Loading bookings...</div>;
  }

  const confirmedCount = bookings.filter((booking) => booking.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter((booking) => booking.status === "CANCELLED").length;

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-stone-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#fef3c7_35%,_#f0fdfa_100%)] p-6 shadow-sm">
        <p className="text-sm font-medium uppercase text-accent-600">My Reservations</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Track confirmed trips and refund activity</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          View all tickets in one place, cancel when needed, and check refund status without leaving the page.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white/95 p-5 shadow-sm">
          <p className="text-sm font-medium text-brand-700">Total bookings</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{bookings.length}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white/95 p-5 shadow-sm">
          <p className="text-sm font-medium text-accent-700">Confirmed</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{confirmedCount}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white/95 p-5 shadow-sm">
          <p className="text-sm font-medium text-sunrise-700">Cancelled</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{cancelledCount}</p>
        </div>
      </section>

      <Alert type="error" message={errorMessage} />

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white/95 p-8 text-sm text-slate-500 shadow-sm">
          <p className="text-base font-medium text-slate-800">No bookings found yet.</p>
          <p className="mt-2">After confirming a ticket, it will show up here with cancellation and refund actions.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="rounded-xl border border-stone-200 bg-white/95 p-6 shadow-sm">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-lg font-semibold text-slate-900">{booking.trainName}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      booking.status === "CONFIRMED"
                        ? "bg-brand-50 text-brand-700"
                        : "bg-sunrise-50 text-sunrise-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
                    <p className="text-xs uppercase text-slate-400">Ticket ID</p>
                    <p className="mt-1 font-medium text-slate-800">{booking.ticketId}</p>
                  </div>
                  <div className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
                    <p className="text-xs uppercase text-slate-400">Passenger</p>
                    <p className="mt-1 font-medium text-slate-800">{booking.passengerName}</p>
                  </div>
                  <div className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
                    <p className="text-xs uppercase text-slate-400">Seat</p>
                    <p className="mt-1 font-medium text-slate-800">S{booking.seatNumber}</p>
                  </div>
                  <div className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
                    <p className="text-xs uppercase text-slate-400">Journey Date</p>
                    <p className="mt-1 font-medium text-slate-800">{booking.journeyDate}</p>
                  </div>
                  <div className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
                    <p className="text-xs uppercase text-slate-400">Departure</p>
                    <p className="mt-1 font-medium text-slate-800">{booking.journeyTime}</p>
                  </div>
                  <div className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
                    <p className="text-xs uppercase text-slate-400">Refund Status</p>
                    <p className="mt-1 font-medium text-slate-800">{booking.refundStatus}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 xl:min-w-[180px]">
                <Button
                  variant="danger"
                  onClick={() => handleCancel(booking.id)}
                  disabled={booking.status === "CANCELLED"}
                >
                  Cancel Ticket
                </Button>
                <Button variant="secondary" onClick={() => handleRefundCheck(booking.id)}>
                  Check Refund
                </Button>
              </div>
            </div>

            {refunds[booking.id] ? (
              <div className="mt-5 rounded-lg border border-accent-100 bg-accent-50 p-4 text-sm text-accent-700">
                <p>Refund Status: {refunds[booking.id].refundStatus}</p>
                <p className="mt-1">Refund Percentage: {refunds[booking.id].refundPercentage}%</p>
              </div>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
}
