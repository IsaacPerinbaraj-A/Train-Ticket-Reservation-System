const express = require("express");
const Train = require("../models/Train");
const { getTimeBucket } = require("../utils/validation");

const router = express.Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeTrain(train) {
  return {
    id: String(train._id),
    name: train.name,
    source: train.source,
    destination: train.destination,
    time: train.time,
    class: train.className,
    seatsAvailable: train.seatsAvailable,
    totalSeats: train.totalSeats
  };
}

router.get("/trains", async (req, res) => {
  const { source = "", destination = "" } = req.query;
  const query = {};

  if (source) query.source = new RegExp(`^${escapeRegex(source)}$`, "i");
  if (destination) query.destination = new RegExp(`^${escapeRegex(destination)}$`, "i");

  const results = await Train.find(query).sort({ name: 1 }).lean();
  return res.json(results.map(serializeTrain));
});

router.get("/trains/filter", async (req, res) => {
  const { source = "", destination = "", time = "", class: travelClass = "", availability = "" } = req.query;
  const query = {};

  if (source) query.source = new RegExp(`^${escapeRegex(source)}$`, "i");
  if (destination) query.destination = new RegExp(`^${escapeRegex(destination)}$`, "i");
  if (travelClass) query.className = new RegExp(`^${escapeRegex(travelClass)}$`, "i");
  if (availability === "available") query.seatsAvailable = { $gt: 0 };

  const trains = await Train.find(query).sort({ name: 1 }).lean();
  const results = trains
    .filter((train) => (time ? getTimeBucket(train.time) === String(time).toLowerCase() : true))
    .map(serializeTrain);

  return res.json(results);
});

module.exports = router;
