const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema({

  // ==========================================
  // USER
  // ==========================================

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ==========================================
  // STUDENT INTERESTS
  // ==========================================

  interests: [
    {
      type: String,
    },
  ],

  // ==========================================
  // PREFERRED CATEGORIES
  // ==========================================

  preferredCategories: [
    {
      type: String,
    },
  ],

  // ==========================================
  // ENGAGEMENT SCORE
  // ==========================================

  engagementScore: {
    type: Number,
    default: 0,
  },

  // ==========================================
  // USER ACTIVITY TRACKING
  // ==========================================

  totalClicks: {
    type: Number,
    default: 0,
  },

  totalJoins: {
    type: Number,
    default: 0,
  },

  totalConversions: {
    type: Number,
    default: 0,
  },

  // ==========================================
  // LAST ACTIVE CATEGORY
  // ==========================================

  lastActiveCategory: {
    type: String,
    default: "",
  },

}, { timestamps: true });

module.exports =
  mongoose.models.UserPreference ||
  mongoose.model(
    "UserPreference",
    preferenceSchema
  );