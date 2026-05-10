require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { seedTrainsIfEmpty } = require("./utils/seed");

const authRoutes = require("./routes/auth");
const trainRoutes = require("./routes/trains");
const bookingRoutes = require("./routes/bookings");
const supportRoutes = require("./routes/support");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ message: "Train Ticket Reservation API is running." });
});

app.use("/api", authRoutes);
app.use("/api", trainRoutes);
app.use("/api", bookingRoutes);
app.use("/api", supportRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

async function startServer() {
  await connectDB();
  await seedTrainsIfEmpty();

  const server = app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Stop the other server process or start this one with a different PORT, for example:`
      );
      console.error(`$env:PORT=5001; npm run dev`);
      process.exit(1);
    }

    console.error("Failed to start backend server:", error.message);
    process.exit(1);
  });
}

startServer().catch((error) => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});
