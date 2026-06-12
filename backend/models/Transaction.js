const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  studentId: { // change from 'user'
    type: String, // String because you're passing req.user.id as string
    ref: "User",
    required: true
  },

  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },

  saleAmount: {
    type: Number,
    default: 0,
  },

  commissionAmount: {
    type: Number,
    default: 0,
  },

  type: {
    type: String,
    enum: ["credit", "debit"],
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
}, { timestamps: true });



module.exports =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);