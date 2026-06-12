const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    referralId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referral",
      required: true,
    },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Click", clickSchema);