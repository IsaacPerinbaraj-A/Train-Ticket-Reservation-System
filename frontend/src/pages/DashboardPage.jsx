import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Alert from "../components/Alert";
import Button from "../components/Button";
import InputField from "../components/InputField";
import TrainCard from "../components/TrainCard";

const defaultSearch = {
  source: "",
  destination: ""
};

const defaultFilters = {
  time: "",
  class: "",
  availability: ""
};

export default function DashboardPage() {
  const [search, setSearch] = useState(defaultSearch);
  const [filters, setFilters] = useState(defaultFilters);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const totalSeatsLeft = trains.reduce((sum, train) => sum + train.seatsAvailable, 0);

  const availableClasses = useMemo(
    () => [...new Set(trains.map((train) => train.class))],
    [trains]
  );

  const fetchTrains = async (useFilterRoute = false) => {
    setLoading(true);
    setErrorMessage("");
    setMessage("");
    try {
      const endpoint = useFilterRoute ? "/trains/filter" : "/trains";
      const params = useFilterRoute ? { ...search, ...filters } : search;
      const response = await api.get(endpoint, { params });
      setTrains(response.data);
      if (response.data.length === 0) {
        setMessage("No trains matched your current search.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to fetch trains.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (event) => {
    setSearch((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleFilterChange = (event) => {
    const nextFilters = { ...filters, [event.target.name]: event.target.value };
    setFilters(nextFilters);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await fetchTrains(false);
  };

  useEffect(() => {
    const hasFilters = Object.values(filters).some(Boolean);
    fetchTrains(hasFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-stone-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#f0fdfa_48%,_#fff7ed_100%)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-accent-600">Reservation Workspace</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Search trains and narrow the results quickly</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Browse the currently available trains right away, then use filters to narrow by route, coach class, and
              live seat availability. Travel date is selected during booking.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f0fdfa_100%)] p-5 shadow-sm">
          <p className="text-sm font-medium text-brand-700">Available trains</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{trains.length}</p>
          <p className="mt-2 text-sm text-slate-500">All visible trains can be booked immediately.</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#fff7ed_100%)] p-5 shadow-sm">
          <p className="text-sm font-medium text-accent-700">Seats left</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalSeatsLeft}</p>
          <p className="mt-2 text-sm text-slate-500">Live availability updates after booking or cancellation.</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#faf5ff_100%)] p-5 shadow-sm">
          <p className="text-sm font-medium text-plum-700">Booking flow</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Search now, choose date later</p>
          <p className="mt-2 text-sm text-slate-500">Users only need to enter the journey date on the booking page.</p>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Search trains</h2>
            <p className="text-sm text-slate-500">Use route and filters to find available options.</p>
          </div>
        </div>
        <form className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr_220px]" onSubmit={handleSearchSubmit}>
          <InputField label="Source" name="source" value={search.source} onChange={handleSearchChange} />
          <InputField label="Destination" name="destination" value={search.destination} onChange={handleSearchChange} />
          <div className="flex items-end">
            <Button className="w-full" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Time</label>
            <select
              name="time"
              value={filters.time}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Class</label>
            <select
              name="class"
              value={filters.class}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {availableClasses.map((travelClass) => (
                <option key={travelClass} value={travelClass}>
                  {travelClass}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Availability</label>
            <select
              name="availability"
              value={filters.availability}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="available">Available only</option>
            </select>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setFilters(defaultFilters);
              fetchTrains(false);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </section>

      <Alert type="error" message={errorMessage} />
      <Alert type="info" message={message} />

      <section className="rounded-xl border border-stone-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-stone-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Available trains</h2>
            <p className="text-sm text-slate-500">Users can view options immediately and choose the travel date in the booking step.</p>
          </div>
          <p className="text-sm text-slate-500">{trains.length} result{trains.length === 1 ? "" : "s"}</p>
        </div>

        <div className="mt-5 space-y-4">
          {trains.map((train) => (
            <TrainCard
              key={train.id}
              train={train}
              onSelect={(selectedTrain) => navigate(`/book/${selectedTrain.id}`, { state: { train: selectedTrain } })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
