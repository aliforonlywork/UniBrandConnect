const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    points: {
      type: Number,
      default: 0,
    },

    level: {
      type: String,
      default: "Beginner",
    },

    badges: [
      {
        title: String,
        description: String,
      },
    ],

    achievements: [String],

    referralsCompleted: {
      type: Number,
      default: 0,
    },

    campaignsJoined: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Leaderboard ||
  mongoose.model("Leaderboard", leaderboardSchema);
