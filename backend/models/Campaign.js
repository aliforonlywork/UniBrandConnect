const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "https://via.placeholder.com/400x250",
    },

    price: {
      type: Number,
      default: 1000,
    },

    commissionRate: {
      type: Number,
      default: 10,
    },

    totalBudget: {
      type: Number,
      default: 0,
    },

    startDate: Date,

    endDate: Date,

    status: {
      type: String,
      default: "pending",
    },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =====================================
    // AI RECOMMENDATION FIELDS
    // =====================================

    category: {
      type: String,
      default: "General",
    },

    tags: [
      {
        type: String,
      },
    ],

    clickCount: {
      type: Number,
      default: 0,
    },

    conversionCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Campaign ||
  mongoose.model("Campaign", campaignSchema);