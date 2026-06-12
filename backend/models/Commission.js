const mongoose = require("mongoose");

const commissionSchema =
  new mongoose.Schema(

    {
      campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },

      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      amount: {
        type: Number,
        required: true,
      },

      status: {
        type: String,

        enum: [
          "earned",
          "pending",
          "paid",
        ],

        default: "earned",
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models.Commission ||

  mongoose.model(
    "Commission",
    commissionSchema
  );