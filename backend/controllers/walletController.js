const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const Referral = require("../models/Referral");
const Campaign = require("../models/Campaign");
const Notification = require("../models/Notification");
const BrandWallet = require("../models/BrandWallet");
const BrandTransaction = require("../models/BrandTransaction");

// ==========================================
// SIMULATE SALE (ADMIN)
// ==========================================

exports.simulateSale = async (
  req,
  res,
  next
) => {

  try {

    const {
      referralCode,
      saleAmount,
    } = req.body;

    const referral =
      await Referral.findOne({
        referralCode,
      });

    if (!referral) {

      return res.status(404).json({
        message: "Referral not found",
      });
    }

    const campaign =
      await Campaign.findById(
        referral.campaignId
      );

    if (!campaign) {

      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    console.log("=== SIMULATE SALE DEBUG ===");
    console.log("Campaign brandId:", campaign.brandId);
    console.log("Campaign brandId type:", typeof campaign.brandId);
    console.log("Is ObjectId:", mongoose.Types.ObjectId.isValid(campaign.brandId));
    console.log("saleAmount:", saleAmount);
    console.log("commissionRate:", campaign.commissionRate);
    // ==========================================
    // COMMISSION CALCULATION
    // ==========================================

    const commission =
      (saleAmount * campaign.commissionRate) / 100;

      const brandRevenue =
saleAmount - commission;

    // ==========================================
    // UPDATE WALLET
    // Atomic $inc to avoid race conditions —
    // consistent with paymentController.js
    // ==========================================

    const wallet = await Wallet.findOneAndUpdate(
      { student: referral.studentId },
      { $inc: { balance: commission } },
      { upsert: true, new: true }
    );

    // ==========================================
    // SAVE TRANSACTION
    // ==========================================

    await Transaction.create({
  studentId: referral.studentId,
  campaignId: referral.campaignId,
  commissionAmount: commission,  // ← change from 'amount'
  type: "credit",
  status: "success",
});

const updatedWallet =await BrandWallet.findOneAndUpdate(
  
{
  brandId: campaign.brandId
},
{
  $inc: {
    totalRevenue: brandRevenue,
    totalGMV: saleAmount,
    totalPaidToStudents: commission
  }
},
{
  upsert: true,
  new: true
}
);

console.log("=== BRAND WALLET UPDATE ===");
console.log("brandId used:", campaign.brandId);
console.log("brandRevenue added:", brandRevenue);
console.log("Updated wallet doc:", updatedWallet);

await BrandTransaction.create({
  brandId: campaign.brandId,
  campaignId: campaign._id,
  referralId: referral._id,
  productPrice: saleAmount,
  commissionAmount: commission,
  brandRevenue
});

    // ==========================================
    // NOTIFICATION
    // ==========================================

    await Notification.create({
      userId: referral.studentId,
      message: `You earned commission of Rs ${commission}.`,
    });

    res.json({
      success: true,
      message: "Commission added successfully",
      commission,
      walletBalance: wallet.balance,
    });

  } catch (error) {

    next(error);
  }
};

// ==========================================
// GET STUDENT WALLET
// ==========================================

exports.getWallet = async (
  req,
  res,
  next
) => {

  try {

    const wallet =
      await Wallet.findOne({
        student: req.user.id,
      });

    // Fix: only return successful credit transactions
    // so failed or debit entries don't appear in wallet history
    const transactions =
      await Transaction.find({
        studentId: req.user.id,
        type: "credit",
        status: "success",
      }).sort({
        createdAt: -1,
      });

    const totalEarnings = transactions.reduce((sum, t) => sum + (t.commissionAmount || 0), 0)

res.json({
  success: true,
  balance: wallet?.balance || 0,
  totalEarnings,  // ← send calculated total
  wallet: wallet || { balance: 0 },
  transactions,
});

  } catch (error) {

    next(error);
  }
};