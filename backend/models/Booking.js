const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trainId: { type: mongoose.Schema.Types.ObjectId, ref: "Train", required: true },
    trainName: { type: String, required: true },
    passengerName: { type: String, required: true },
    passengerEmail: { type: String, required: true },
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ["CONFIRMED", "CANCELLED"], default: "CONFIRMED" },
    refundStatus: { type: String, enum: ["NOT_REQUESTED", "PROCESSED"], default: "NOT_REQUESTED" },
    refundAmount: { type: Number, default: 0 },
    journeyDate: { type: String, required: true },
    journeyTime: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
