const Withdrawal = require("../models/Withdrawal");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");

// ==========================================
// STUDENT REQUEST WITHDRAWAL
// ==========================================

exports.requestWithdrawal = async (
  req,
  res,
  next
) => {
  try {

    const { amount } = req.body;

    // ======================================
    // GET STUDENT WALLET
    // ======================================

    const wallet =
      await Wallet.findOne({

        student: req.user.id,
      });

    // ======================================
    // VALIDATE BALANCE
    // ======================================

    if (
      !wallet ||
      wallet.balance < amount
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Insufficient balance",
      });
    }

    // ======================================
    // CREATE WITHDRAWAL REQUEST
    // ======================================

    const withdrawal =
      await Withdrawal.create({

        student: req.user.id,

        amount,
      });

    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({

      success: true,

      withdrawal,
    });

  } catch (error) {

    next(error);
  }
};

// ==========================================
// ADMIN GET ALL WITHDRAWALS
// ==========================================

exports.getAllWithdrawals = async (
  req,
  res,
  next
) => {
  try {

    const withdrawals =
      await Withdrawal.find()

      .populate(
        "student",
        "name email"
      )

      .sort({
        createdAt: -1,
      });

    res.json({

      success: true,

      withdrawals,
    });

  } catch (error) {

    next(error);
  }
};

// ==========================================
// ADMIN APPROVE WITHDRAWAL
// ==========================================

exports.approveWithdrawal = async (
  req,
  res,
  next
) => {
  try {

    const withdrawal =
      await Withdrawal.findById(
        req.params.id
      );

    // ======================================
    // VALIDATE WITHDRAWAL
    // ======================================

    if (!withdrawal) {

      return res.status(404).json({

        success: false,

        message: "Not found",
      });
    }

    if (
      withdrawal.status !== "pending"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Already processed",
      });
    }

    // ======================================
    // GET WALLET
    // ======================================

    const wallet =
      await Wallet.findOne({

        student:
          withdrawal.student,
      });

    // ======================================
    // VALIDATE WALLET
    // ======================================

    if (!wallet) {

      return res.status(404).json({

        success: false,

        message:
          "Wallet not found",
      });
    }

    // ======================================
    // DEDUCT BALANCE
    // ======================================

    wallet.balance -=
      withdrawal.amount;

    await wallet.save();

    // ======================================
    // UPDATE WITHDRAWAL STATUS
    // ======================================

    withdrawal.status =
      "approved";

    await withdrawal.save();

    // ======================================
    // CREATE TRANSACTION
    // ======================================

    await Transaction.create({

      user:
        withdrawal.student,

      amount:
        withdrawal.amount,

      type: "debit",

      status: "success",
    });

    // ======================================
    // CREATE NOTIFICATION
    // ======================================

    await Notification.create({

      userId:
        withdrawal.student,

      message:
        `Your withdrawal of ${withdrawal.amount} has been approved.`,
    });

    // ======================================
    // RESPONSE
    // ======================================

    res.json({

      success: true,

      message:
        "Withdrawal approved",
    });

  } catch (error) {

    next(error);
  }
};

// ==========================================
// ADMIN REJECT WITHDRAWAL
// ==========================================

exports.rejectWithdrawal = async (
  req,
  res,
  next
) => {
  try {

    const withdrawal =
      await Withdrawal.findById(
        req.params.id
      );

    // ======================================
    // VALIDATE WITHDRAWAL
    // ======================================

    if (!withdrawal) {

      return res.status(404).json({

        success: false,

        message: "Not found",
      });
    }

    // ======================================
    // UPDATE STATUS
    // ======================================

    withdrawal.status =
      "rejected";

    await withdrawal.save();

    // ======================================
    // CREATE NOTIFICATION
    // ======================================

    await Notification.create({

      userId:
        withdrawal.student,

      message:
        `Your withdrawal of ${withdrawal.amount} was rejected.`,
    });

    // ======================================
    // RESPONSE
    // ======================================

    res.json({

      success: true,

      message:
        "Withdrawal rejected",
    });

  } catch (error) {

    next(error);
  }
};