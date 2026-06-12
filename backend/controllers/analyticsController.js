const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Click = require("../models/Click");
const Transaction = require("../models/Transaction");
const Referral = require("../models/Referral");
const Brand = require("../models/Brand");      
const BrandWallet = require("../models/BrandWallet");
const BrandTransaction = require("../models/BrandTransaction");

// ======================
// STUDENT ANALYTICS
// ======================

exports.getStudentAnalytics = async (
  req,
  res
) => {
  try {

    const studentId = req.user.id;

    const totalReferrals =
      await Referral.countDocuments({
        studentId,
      });

    const referrals =
      await Referral.find({
        studentId,
      });

    const referralIds =
      referrals.map((r) => r._id);

    const totalClicks =
      await Click.countDocuments({
        referralId: {
          $in: referralIds,
        },
      });

    // Count how many times the student earned (credit transactions)
    const totalEarnings =
      await Transaction.countDocuments({
        studentId: studentId,
        type: "credit",
        status: "success",
      });

    // Sum all earned amounts from transaction ledger
    const earningsData = await Transaction.aggregate([
  {
    $match: {
      studentId: { $in: [studentId, new mongoose.Types.ObjectId(studentId)] },
      type: "credit",
      status: "success",
    },
  },
  {
    $group: {
      _id: null,
      totalEarnings: { $sum: "$commissionAmount" },
    },
  },
]);

    const joinedCampaigns =
      await Referral.distinct("campaignId", {
        studentId,
      });

    const computedEarnings =
      earningsData[0]?.totalEarnings || 0;

    // Read wallet balance — updated by paymentController on each payment
    const wallet = await Wallet.findOne({
      student: studentId,
    });
    const walletBalance = wallet?.balance || 0;

    res.json({
      referrals: totalReferrals,
      clicks: totalClicks,
      purchases: totalEarnings,      // fix: was totalPurchases (undefined)
      earnings: computedEarnings,    // total earned from transaction ledger
      walletBalance: walletBalance,  // live spendable balance from wallet
      campaigns: joinedCampaigns.length,
    });

  } catch (error) {

    res.status(500).json({
      message: "Student analytics error",
      error,
    });
  }
};

// ======================
// COMPANY ANALYTICS
// ======================

exports.getCompanyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get Brand doc from User ID
    const brand = await Brand.findOne({ brandId: userId });
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    
    const brandId = brand._id; // 6a22b1b35f5e41808b14d35d

    const campaigns = await Campaign.find({ brandId: brandId });
    const campaignIds = campaigns.map(c => c._id);

    const totalCampaigns = campaigns.length;
    const totalReferrals = await Referral.countDocuments({ campaignId: { $in: campaignIds } });
    const totalSales = await Transaction.countDocuments({ campaignId: { $in: campaignIds }, status: "success", type: "credit" });
    const activeStudents = await Referral.distinct("studentId", { campaignId: { $in: campaignIds } });

    // Brand Wallet - now uses correct brandId
    const wallet = await BrandWallet.findOne({ brandId: brandId });

    res.json({
      campaigns: totalCampaigns,
      sales: totalSales,
      referrals: totalReferrals,
      students: activeStudents.length,
      revenue: wallet?.totalRevenue || 0,
      gmv: wallet?.totalGMV || 0,
      paidToStudents: wallet?.totalPaidToStudents || 0,
    });
  } catch (error) {
    console.log("Company analytics error:", error);
    res.status(500).json({ message: "Company analytics error", error: error.message });
  }
};
// ======================
// ADMIN ANALYTICS
// ======================

exports.getAdminAnalytics = async (req, res) => {
  try {

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalCompanies = await User.countDocuments({
      role: "brand",
    });

    const totalCampaigns = await Campaign.countDocuments();

    const totalReferrals = await Referral.countDocuments();

    const totalTransactions = await Transaction.countDocuments();

    res.json({
      students: totalStudents,
      companies: totalCompanies,
      campaigns: totalCampaigns,
      referrals: totalReferrals,
      transactions: totalTransactions,
    });

  } catch (error) {
    res.status(500).json({
      message: "Admin analytics error",
      error,
    });
  }
};

// ======================
// CAMPAIGN ANALYTICS
// ======================


exports.getCampaignAnalytics = async (req, res) => {
  try {
    const campaignId = req.params.campaignId || req.params.id;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const referrals = await Referral.find({ campaignId });
    const referralIds = referrals.map((r) => r._id);

    const totalClicks = await Click.countDocuments({
      referralId: { $in: referralIds },
    });

    const totalConversions = referrals.length; // fix

    const stats = await BrandTransaction.aggregate([
      {
        $match: {
          campaignId: new mongoose.Types.ObjectId(campaignId),
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$brandRevenue" },
          totalCommission: { $sum: "$commissionAmount" },
        },
      },
    ]);

    const totalRevenue = stats[0]?.totalRevenue || 0;
    const totalCommission = stats[0]?.totalCommission || 0;

    const conversionRate =
      totalClicks > 0
       ? ((totalConversions / totalClicks) * 100).toFixed(1)
        : 0;

    const engagementRate =
      totalClicks > 0
       ? Math.min((totalConversions / totalClicks) * 100, 100).toFixed(0)
        : 0;

    const revenueGoal = campaign.totalBudget || 10000;

    const revenuePerformance =
      revenueGoal > 0
       ? Math.min((totalRevenue / revenueGoal) * 100, 100).toFixed(0)
        : 0;

    res.json({
      totalClicks,
      totalConversions,
      totalRevenue,
      totalCommission,
      conversionRate: Number(conversionRate),
      engagementRate: Number(engagementRate),
      revenuePerformance: Number(revenuePerformance),
    });

  } catch (error) {
    console.log(error); // add this to see exact error
    res.status(500).json({
      message: "Analytics error",
      error: error.message,
    });
  }
};

// ======================
// PLATFORM ANALYTICS
// ======================

exports.getPlatformAnalytics = async (req, res) => {
  try {
    const totalClicks = await Click.countDocuments();
    const totalConversions = await Referral.countDocuments();

    // Sum commissionAmount from BrandTransaction = platform revenue
    const revenueData = await BrandTransaction.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$commissionAmount" }
        }
      }
    ]);

    res.json({
      totalClicks,
      totalConversions,
      totalRevenue: revenueData[0]?.totalRevenue || 0
    });

  } catch (error) {
    res.status(500).json({
      message: "Platform analytics error",
      error: error.message
    });
  }
};

// ======================
// BRAND REVENUE FOR DASHBOARD CARD
// ======================

exports.getBrandRevenue = async (req, res) => {
  try {
    const brand = await Brand.findOne({ userId: req.user._id });
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    
    const wallet = await BrandWallet.findOne({ brandId: brand._id });
    
    res.json({ 
      revenue: wallet?.totalRevenue || 0,
      gmv: wallet?.totalGMV || 0,
      paidToStudents: wallet?.totalPaidToStudents || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};