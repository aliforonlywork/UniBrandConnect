const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permissions: {
      type: [String],
      default: [
        "approve_campaign",
        "approve_withdrawal",
        "view_reports",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);