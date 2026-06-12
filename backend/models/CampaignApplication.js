const mongoose = require("mongoose");

const campaignApplicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
campaignApplicationSchema.index(
  { studentId: 1, campaignId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "CampaignApplication",
  campaignApplicationSchema
);