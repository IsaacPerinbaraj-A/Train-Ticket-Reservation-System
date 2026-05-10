const express = require("express");
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const { processedBookingRequests } = require("../data/store");
const { authMiddleware } = require("../middleware/auth");
const { calculateRefundPercentage } = require("../utils/validation");

const router = express.Router();

function buildTicketId() {
  return `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function serializeBooking(booking) {
  return {
    id: String(booking._id),
    ticketId: booking.ticketId,
    userId: String(booking.userId),
    trainId: String(booking.trainId),
    trainName: booking.trainName,
    passengerName: booking.passengerName,
    passengerEmail: booking.passengerEmail,
    seatNumber: booking.seatNumber,
    status: booking.status,
    refundStatus: booking.refundStatus,
    refundAmount: booking.refundAmount,
    journeyDate: booking.journeyDate,
    journeyTime: booking.journeyTime,
    createdAt: booking.createdAt
  };
}

function isValidJourneyDate(value) {
  if (!value) return false;
  const selectedDate = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(selectedDate.getTime()) && selectedDate >= today;
}

router.post("/book", authMiddleware, async (req, res) => {
  const {
    trainId,
    passengerName,
    passengerEmail,
    journeyDate,
    seatNumber,
    autoAllocate = false,
    requestId
  } = req.body;

  if (requestId && processedBookingRequests.has(requestId)) {
    const existingBookingId = processedBookingRequests.get(requestId);
    const existingBooking = await Booking.findById(existingBookingId).lean();
    const existingTrain = existingBooking ? await Train.findById(existingBooking.trainId).lean() : null;
    return res.json({
      message: "Booking already processed.",
      booking: existingBooking ? serializeBooking(existingBooking) : null,
      seatMap: existingTrain?.seats || []
    });
  }

  const train = await Train.findById(trainId);
  if (!train) {
    return res.status(404).json({ message: "Train not found." });
  }

  if (!passengerName || !passengerEmail) {
    return res.status(400).json({ message: "Passenger details are required." });
  }

  if (!isValidJourneyDate(journeyDate)) {
    return res.status(400).json({ message: "Please select a valid journey date for booking." });
  }

  if (train.seatsAvailable <= 0) {
    return res.status(400).json({ message: "No seats available on this train." });
  }

  let targetSeat = null;

  if (autoAllocate) {
    targetSeat = train.seats.find((seat) => !seat.booked);
  } else {
    targetSeat = train.seats.find((seat) => seat.seatNumber === Number(seatNumber));
  }

  if (!targetSeat) {
    return res.status(400).json({ message: "Selected seat does not exist or is unavailable." });
  }

  if (targetSeat.booked) {
    return res.status(409).json({ message: "Seat already booked. Please choose another seat." });
  }

  targetSeat.booked = true;

  const booking = await Booking.create({
    ticketId: buildTicketId(),
    userId: req.user.id,
    trainId: train._id,
    trainName: train.name,
    passengerName,
    passengerEmail,
    seatNumber: targetSeat.seatNumber,
    journeyDate,
    journeyTime: train.time
  });

  targetSeat.bookingId = booking.id;
  train.seatsAvailable -= 1;
  await train.save();

  if (requestId) {
    processedBookingRequests.set(requestId, booking.id);
  }

  console.log(`[NOTIFICATION] Booking confirmed for ${passengerEmail}. Ticket ${booking.ticketId}`);

  return res.status(201).json({
    message: "Booking confirmed.",
    booking: serializeBooking(booking.toObject()),
    seatMap: train.seats
  });
});

router.get("/booking/:id", authMiddleware, async (req, res) => {
  const booking = await Booking.findById(req.params.id).lean();

  if (!booking || String(booking.userId) !== String(req.user._id)) {
    return res.status(404).json({ message: "Booking not found." });
  }

  return res.json(serializeBooking(booking));
});

router.get("/bookings", authMiddleware, async (req, res) => {
  const userBookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.json(userBookings.map(serializeBooking));
});

router.post("/cancel/:id", authMiddleware, async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking || String(booking.userId) !== String(req.user._id)) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (booking.status === "CANCELLED") {
    return res.status(400).json({ message: "Booking has already been cancelled." });
  }

  booking.status = "CANCELLED";

  const train = await Train.findById(booking.trainId);
  const seat = train?.seats.find((entry) => entry.seatNumber === booking.seatNumber);

  if (train) {
    train.seatsAvailable += 1;
  }

  if (seat) {
    seat.booked = false;
    seat.bookingId = null;
  }

  const refundPercentage = calculateRefundPercentage(booking.journeyDate, booking.journeyTime);
  booking.refundAmount = refundPercentage;
  booking.refundStatus = "PROCESSED";

  await booking.save();
  if (train) {
    await train.save();
  }

  console.log(
    `[NOTIFICATION] Booking ${booking.ticketId} cancelled. Refund ${refundPercentage}% processed for ${booking.passengerEmail}`
  );

  return res.json({
    message: "Booking cancelled successfully.",
    booking: serializeBooking(booking.toObject())
  });
});

router.get("/refund/:id", authMiddleware, async (req, res) => {
  const booking = await Booking.findById(req.params.id).lean();

  if (!booking || String(booking.userId) !== String(req.user._id)) {
    return res.status(404).json({ message: "Booking not found." });
  }

  return res.json({
    ticketId: booking.ticketId,
    refundStatus: booking.refundStatus,
    refundPercentage: booking.refundAmount
  });
});

router.get("/seats/:trainId", authMiddleware, async (req, res) => {
  const train = await Train.findById(req.params.trainId).lean();
  if (!train) {
    return res.status(404).json({ message: "Train not found." });
  }

  return res.json(train.seats);
});

module.exports = router;
