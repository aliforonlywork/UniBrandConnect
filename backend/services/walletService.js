const Wallet = require("../models/Wallet");

exports.creditWallet = async (studentId, amount) => {

  // =====================================
  // UPSERT WALLET (CREATE IF NOT EXISTS)
  // + INCREMENT BALANCE ATOMICALLY
  // =====================================

  const wallet = await Wallet.findOneAndUpdate(
    { student: studentId },
    { $inc: { balance: amount } },
    { upsert: true, new: true }
  );

  return wallet;
};