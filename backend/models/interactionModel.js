const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },

  action: {
    type: String,
    enum: ["view", "click", "join", "ignore"],
  },
},
{ timestamps: true }
);

module.exports = mongoose.model(
  "Interaction",
  interactionSchema
);