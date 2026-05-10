const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: Number, required: true },
    booked: { type: Boolean, default: false },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null }
  },
  { _id: false }
);

const trainSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    time: { type: String, required: true },
    className: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    seatsAvailable: { type: Number, required: true },
    seats: { type: [seatSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Train", trainSchema);
