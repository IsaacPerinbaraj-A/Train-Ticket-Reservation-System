export default function SeatGrid({ seats, selectedSeat, onSeatSelect }) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 xl:grid-cols-6">
      {seats.map((seat) => {
        const isSelected = selectedSeat === seat.seatNumber;
        return (
          <button
            key={seat.seatNumber}
            type="button"
            onClick={() => !seat.booked && onSeatSelect(seat.seatNumber)}
            disabled={seat.booked}
            className={`h-14 rounded-lg border text-sm font-medium transition ${
              seat.booked
                ? "cursor-not-allowed border-rose-200 bg-rose-50 text-rose-700"
                : isSelected
                  ? "border-brand-600 bg-gradient-to-br from-brand-50 to-plum-50 text-brand-700 shadow-sm"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100"
            }`}
          >
            S{seat.seatNumber}
          </button>
        );
      })}
    </div>
  );
}
