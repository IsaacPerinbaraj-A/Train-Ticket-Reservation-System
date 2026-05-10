const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const { sessions } = require("../data/store");
const { validateEmail, validatePassword } = require("../utils/validation");
const { authMiddleware, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!name || !validateEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid name and email." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include a number and special character."
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      verified: false
    });

    await VerificationToken.create({
      token: verificationToken,
      userId: user._id
    });

    console.log(
      `[VERIFY EMAIL] Open http://localhost:${process.env.PORT || 5000}/api/verify/${verificationToken} to verify ${normalizedEmail}`
    );

    return res.status(201).json({
      message: "Registration successful. Please verify your email using the link logged in the backend console."
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed." });
  }
});

router.get("/verify/:token", async (req, res) => {
  const verificationEntry = await VerificationToken.findOne({ token: req.params.token });

  if (!verificationEntry) {
    return res.status(400).json({ message: "Verification token is invalid or expired." });
  }

  const user = await User.findById(verificationEntry.userId);
  if (!user) {
    await VerificationToken.deleteOne({ _id: verificationEntry._id });
    return res.status(404).json({ message: "User not found." });
  }

  user.verified = true;
  await user.save();
  await VerificationToken.deleteOne({ _id: verificationEntry._id });

  return res.json({ message: "Email verified successfully." });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const passwordMatches = await bcrypt.compare(password || "", user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" }
    );

    sessions.add(token);

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed." });
  }
});

router.post("/logout", authMiddleware, (req, res) => {
  sessions.delete(req.token);
  return res.json({ message: "Logged out successfully." });
});

module.exports = router;
