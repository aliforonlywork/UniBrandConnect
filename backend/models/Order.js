// =======================================
// models/Order.js
// =======================================

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerEmail: String,

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },

    referralId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referral",
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    stripeSessionId: {
      type: String,
      unique: true,
    },

    amountPaid: Number,

    paymentStatus: {
      type: String,
      default: "paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);