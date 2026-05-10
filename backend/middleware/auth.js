const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sessions } = require("../data/store");

const JWT_SECRET = process.env.JWT_SECRET || "train-app-secret";

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).lean();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
  authMiddleware,
  JWT_SECRET
};
