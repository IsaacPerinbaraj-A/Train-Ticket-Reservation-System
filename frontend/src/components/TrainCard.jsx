import Button from "./Button";

export default function TrainCard({ train, onSelect }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{train.name}</h3>
            <span className="rounded-full bg-gradient-to-r from-brand-50 to-plum-50 px-3 py-1 text-xs font-medium text-slate-800">
              {train.class}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{train.id}</p>
        </div>
        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Route</p>
            <p>{train.source} to {train.destination}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Departure Time</p>
            <p>{train.time}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Booking Step</p>
            <p>Choose journey date while booking</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Seats Left</p>
            <p>{train.seatsAvailable}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Live seats are shown now. Travel date will be collected on the next step.</p>
          <Button onClick={() => onSelect(train)} disabled={train.seatsAvailable <= 0}>
            {train.seatsAvailable > 0 ? "Book This Train" : "Sold Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
