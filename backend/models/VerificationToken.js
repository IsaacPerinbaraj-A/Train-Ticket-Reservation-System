const mongoose = require("mongoose");

const verificationTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("VerificationToken", verificationTokenSchema);
