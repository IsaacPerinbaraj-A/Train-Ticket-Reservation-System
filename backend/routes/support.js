const express = require("express");
const SupportTicket = require("../models/SupportTicket");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

function serializeSupportTicket(ticket) {
  return {
    id: String(ticket._id),
    userId: String(ticket.userId),
    subject: ticket.subject,
    message: ticket.message,
    status: ticket.status,
    createdAt: ticket.createdAt
  };
}

router.post("/support", authMiddleware, async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: "Subject and message are required." });
  }

  const ticket = await SupportTicket.create({
    userId: req.user._id,
    subject,
    message,
    status: "OPEN"
  });

  console.log(`[SUPPORT] Ticket ${ticket.id} created for user ${req.user.email}`);

  return res.status(201).json({
    message: "Support ticket created successfully.",
    ticket: serializeSupportTicket(ticket.toObject())
  });
});

router.get("/support/:userId", authMiddleware, async (req, res) => {
  if (String(req.user._id) !== req.params.userId) {
    return res.status(403).json({ message: "You can only view your own support tickets." });
  }

  const tickets = await SupportTicket.find({ userId: req.params.userId }).sort({ createdAt: -1 }).lean();
  return res.json(tickets.map(serializeSupportTicket));
});

module.exports = router;
