const mongoose = require("mongoose");

const campaignAnalyticsSchema =
  new mongoose.Schema(
    {

      // ======================================
      // CAMPAIGN
      // ======================================

      campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
      },

      // ======================================
      // STUDENT
      // ======================================

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      // ======================================
      // TOTAL VIEWS
      // ======================================

      views: {
        type: Number,
        default: 0,
      },

      // ======================================
      // TOTAL CLICKS
      // ======================================

      clicks: {
        type: Number,
        default: 0,
      },

      // ======================================
      // TOTAL CONVERSIONS
      // ======================================

      conversions: {
        type: Number,
        default: 0,
      },

      // ======================================
      // CTR
      // ======================================

      clickThroughRate: {
        type: Number,
        default: 0,
      },

      // ======================================
      // CONVERSION RATE
      // ======================================

      conversionRate: {
        type: Number,
        default: 0,
      },

      // ======================================
      // LAST ACTIVITY
      // ======================================

      lastInteraction: {
        type: Date,
        default: Date.now,
      },

    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models.CampaignAnalytics ||
  mongoose.model(
    "CampaignAnalytics",
    campaignAnalyticsSchema
  );