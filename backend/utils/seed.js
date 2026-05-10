const Train = require("../models/Train");
const trainSeed = require("../data/trainSeed");

async function seedTrainsIfEmpty() {
  const existingCount = await Train.countDocuments();
  if (existingCount > 0) return;

  const docs = trainSeed.map((train) => ({
    ...train,
    seatsAvailable: train.totalSeats,
    seats: Array.from({ length: train.totalSeats }, (_, index) => ({
      seatNumber: index + 1,
      booked: false,
      bookingId: null
    }))
  }));

  await Train.insertMany(docs);
  console.log("Seeded initial train data into MongoDB.");
}

module.exports = {
  seedTrainsIfEmpty
};
