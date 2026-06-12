// models/BrandWallet.js
const mongoose = require("mongoose"); 

const brandWalletSchema = new mongoose.Schema({
  brandId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Brand", 
    required: true, 
    unique: true 
  },
  totalRevenue: { type: Number, default: 0 }, // 90% - brand's net money
  totalGMV: { type: Number, default: 0 }, // 100% - total sales
  totalPaidToStudents: { type: Number, default: 0 } // 10% - commission out
}, { timestamps: true });

module.exports = mongoose.model("BrandWallet", brandWalletSchema);