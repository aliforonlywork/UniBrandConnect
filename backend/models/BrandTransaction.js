// models/BrandTransaction.js
const mongoose = require("mongoose"); 

const brandTransactionSchema = new mongoose.Schema({
  brandId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Brand", 
    required: true 
  },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  referralId: { type: mongoose.Schema.Types.ObjectId, ref: "Referral" },
  orderId: String,
  productPrice: Number, // 100
  commissionAmount: Number, // 10
  brandRevenue: Number, // 90 - this is what you called "revenue"
}, { timestamps: true });

module.exports = mongoose.model("BrandTransaction", brandTransactionSchema);