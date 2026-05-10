import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import Alert from "../components/Alert";
import Button from "../components/Button";
import InputField from "../components/InputField";
import SeatGrid from "../components/SeatGrid";

export default function BookingPage() {
  const { trainId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const train = location.state?.train;

  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [autoAllocate, setAutoAllocate] = useState(false);
  const [seats, setSeats] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const requestId = useMemo(() => crypto.randomUUID(), []);

  useEffect(() => {
    const loadSeats = async () => {
      try {
        const response = await api.get(`/seats/${trainId}`);
        setSeats(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Unable to load seats.");
      } finally {
        setLoadingSeats(false);
      }
    };

    loadSeats();
  }, [trainId]);

  const handleBooking = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/book", {
        trainId,
        passengerName,
        passengerEmail,
        journeyDate,
        seatNumber: selectedSeat,
        autoAllocate,
        requestId
      });
      setBooking(response.data.booking);
      setSeats(response.data.seatMap);
      const storage = localStorage.getItem("train_token") ? localStorage : sessionStorage;
      storage.setItem(`booking_${response.data.booking.id}`, JSON.stringify(response.data.booking.id));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!train) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <Alert type="error" message="Train details are missing. Please search again." />
        <div className="mt-4">
          <Button onClick={() => navigate("/dashboard")} variant="secondary">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-stone-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#f0fdfa_52%,_#fff7ed_100%)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-accent-600">Booking Workspace</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">{train.name}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review the route, pick a valid journey date, and reserve your preferred seat with live availability.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/70 bg-white/80 px-4 py-3 text-sm shadow-sm">
              <p className="text-xs uppercase text-slate-400">Route</p>
              <p className="mt-1 font-medium text-slate-800">{train.source} to {train.destination}</p>
            </div>
            <div className="rounded-lg border border-white/70 bg-white/80 px-4 py-3 text-sm shadow-sm">
              <p className="text-xs uppercase text-slate-400">Departure</p>
              <p className="mt-1 font-medium text-slate-800">{train.time}</p>
            </div>
            <div className="rounded-lg border border-white/70 bg-white/80 px-4 py-3 text-sm shadow-sm">
              <p className="text-xs uppercase text-slate-400">Seats left</p>
              <p className="mt-1 font-medium text-slate-800">{seats.filter((seat) => !seat.booked).length}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-stone-200 bg-white/95 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Seat selection</h2>
          <p className="mt-1 text-sm text-slate-500">
            {train.name} from {train.source} to {train.destination} at {train.time}
          </p>
          <Alert type="error" message={errorMessage} />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InputField label="Passenger Name" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} />
            <InputField label="Passenger Email" value={passengerEmail} onChange={(e) => setPassengerEmail(e.target.value)} />
            <InputField
              label="Journey Date"
              type="date"
              value={journeyDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="md:col-span-2"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Seat allocation mode</p>
              <p className="text-sm text-slate-500">Pick your own seat or let the system assign the next free one.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={autoAllocate} onChange={(e) => setAutoAllocate(e.target.checked)} />
              Auto allocate seat
            </label>
          </div>

          <div className="mt-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Available seats</h3>
                <p className="text-xs text-slate-500">Choose from the live seat map below.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">Available</span>
                <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-brand-700">Selected</span>
                <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700">Booked</span>
              </div>
            </div>
            {loadingSeats ? (
              <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 p-6 text-sm text-slate-500">
                Loading seats...
              </div>
            ) : (
              <SeatGrid seats={seats} selectedSeat={selectedSeat} onSeatSelect={setSelectedSeat} />
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white/95 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Booking summary</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Train</span>
                <span className="font-medium text-slate-800">{train.name}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Class</span>
                <span className="font-medium text-slate-800">{train.class}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Journey Date</span>
                <span className="font-medium text-slate-800">{journeyDate || "-"}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Passenger</span>
                <span className="font-medium text-slate-800">{passengerName || "-"}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Email</span>
                <span className="break-all text-right font-medium text-slate-800">{passengerEmail || "-"}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Seat</span>
                <span className="font-medium text-slate-800">
                  {autoAllocate ? "Auto allocation" : selectedSeat ? `S${selectedSeat}` : "-"}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Button
                onClick={handleBooking}
                disabled={loading || !passengerName || !passengerEmail || !journeyDate || (!autoAllocate && !selectedSeat)}
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </Button>
              <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#fff7ed_100%)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Before you confirm</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="rounded-lg border border-white/80 bg-white/80 px-4 py-3">Make sure the journey date is correct.</li>
              <li className="rounded-lg border border-white/80 bg-white/80 px-4 py-3">Booked seats cannot be selected again by another user.</li>
              <li className="rounded-lg border border-white/80 bg-white/80 px-4 py-3">Refund percentage depends on how early the ticket is cancelled.</li>
            </ul>
          </div>

          {booking ? (
            <div className="rounded-xl border border-accent-200 bg-accent-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-accent-700">Booking confirmed</p>
              <p className="mt-2 text-sm text-accent-700">Ticket ID: {booking.ticketId}</p>
              <p className="text-sm text-accent-700">Seat Number: S{booking.seatNumber}</p>
              <div className="mt-4">
                <Button variant="secondary" onClick={() => navigate("/bookings", { state: { highlightId: booking.id } })}>
                  View Ticket Details
                </Button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
