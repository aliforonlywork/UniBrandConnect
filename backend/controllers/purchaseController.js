const Brand = require("../models/Brand");
const Campaign = require("../models/Campaign");
const Referral = require("../models/Referral");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const BrandWallet = require("../models/BrandWallet");
const BrandTransaction = require("../models/BrandTransaction");

exports.handlePurchase = async (req, res, next) => {
  try {
    const { referralId, orderId, productPrice } = req.body;

    // 1. Get referral + campaign + brand
    const referral = await Referral.findById(referralId).populate("campaignId");
    if (!referral) return res.status(404).json({ error: "Invalid referral" });

    const campaign = referral.campaignId;
    const brand = await Brand.findById(campaign.brandId);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    // 2. Calculate split
    const commissionPercent = campaign.commissionPercent || 10;
    const commissionAmount = (productPrice * commissionPercent) / 100; // 10% of 100 = 10
    const brandRevenue = productPrice - commissionAmount; // 100 - 10 = 90

    // 3. Student wallet + transaction
    await StudentWallet.findOneAndUpdate(
      { studentId: referral.studentId },
      { $inc: { totalEarnings: commissionAmount } },
      { upsert: true, new: true }
    );

    await StudentTransaction.create({
      studentId: referral.studentId,
      campaignId: campaign._id,
      referralId,
      orderId,
      amount: commissionAmount,
      type: "commission",
      status: "credited"
    });

    // 4. Brand wallet + transaction - instant credit, no approval
    await BrandWallet.findOneAndUpdate(
      { brandId: brand._id },
      { 
        $inc: { 
          totalRevenue: brandRevenue, 
          totalGMV: productPrice, 
          totalPaidToStudents: commissionAmount 
        } 
      },
      { upsert: true, new: true }
    );

    await BrandTransaction.create({
      brandId: brand._id,
      campaignId: campaign._id,
      referralId,
      orderId,
      productPrice,
      commissionAmount,
      brandRevenue // 90 stored here
    });

    res.json({
      success: true,
      split: {
        productPrice,
        commissionAmount,
        brandRevenue
      }
    });

  } catch (error) {
    next(error);
  }
};