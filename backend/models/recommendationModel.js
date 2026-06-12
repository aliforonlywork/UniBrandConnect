const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // RECOMMENDED CAMPAIGN
    // ==========================================

    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    // ==========================================
    // AI SCORE
    // ==========================================

    score: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // WHY RECOMMENDED
    // ==========================================

    reason: {
      type: String,
      default: "AI Suggested",
    },

    // ==========================================
    // USER INTERACTION TRACKING
    // ==========================================

    clicked: {
      type: Boolean,
      default: false,
    },

    joined: {
      type: Boolean,
      default: false,
    },

    converted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Recommendation ||
  mongoose.model(
    "Recommendation",
    recommendationSchema
  );