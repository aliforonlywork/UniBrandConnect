const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ======================================
    // NAME
    // ======================================

    name: {
      type: String,
      required: true,
    },

    // ======================================
    // EMAIL
    // ======================================

    email: {
      type: String,
      unique: true,
      required: true,
    },

    // ======================================
    // PASSWORD
    // ======================================

    password: {
      type: String,
      required: true,
    },

    // ======================================
    // UNIVERSITY
    // ======================================

    university: {
      type: String,
      default: "UCP",
    },

    // ======================================
    // ROLE
    // ======================================

    role: {
      type: String,

      enum: [
        "admin",
        "brand",
        "student",
        "university",
      ],

      default: "student",
    },

    // ======================================
    // BRAND APPROVAL
    // ======================================

    isApproved: {
      type: Boolean,
      default: false,
    },

    approvalStatus: {
      type: String,

      enum: [
        "pending",
        "approved",
        "rejected",
      ],

      default: "pending",
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User ||
  mongoose.model(
    "User",
    userSchema
  );