const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },

    referralCode: {
      type: String,
      required: true,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    earnings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referral", referralSchema);