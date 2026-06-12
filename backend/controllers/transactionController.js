const Transaction = require("../models/Transaction");

// Get My Transactions
exports.getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// Admin - Get All Transactions
exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};