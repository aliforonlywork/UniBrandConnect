// controllers/campaignController.js

const Campaign = require("../models/Campaign");

const Referral = require("../models/Referral");

const Brand = require("../models/Brand");

const BrandTransaction = require("../models/BrandTransaction");
// ==========================================
// CREATE CAMPAIGN
// ==========================================

exports.createCampaign = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      commissionRate,
      totalBudget,
      startDate,
      endDate,

      // =========================
      // NEW AI FIELDS
      // =========================
      category,
      tags,
    } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const campaign = await Campaign.create({
      title,
      description,
      image,
      price,
      commissionRate,
      totalBudget,

      startDate: startDate
        ? new Date(startDate)
        : null,

      endDate: endDate
        ? new Date(endDate)
        : null,

      // =========================
      // AI RECOMMENDATION DATA
      // =========================

      category: category || "General",

      tags: tags
        ? tags.split(",").map(tag => tag.trim())
        : [],

      brandId: req.user.id,

      // IMPORTANT
      status: "pending",
      isActive: false,
    });

    global.io.emit("analyticsUpdated");

    res.status(201).json({
      success: true,
      campaign,
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL APPROVED CAMPAIGNS
// ==========================================

exports.getAllCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({
      status: "approved",
    }).populate("brandId", "name email");

    res.json({
      success: true,
      campaigns,
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET BRAND CAMPAIGNS
// ==========================================

exports.getBrandCampaigns = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ brandId: req.user.id });
    
    if (!brand) {
      return res.status(404).json({ error: "Brand profile not found for this user" });
    }

    const campaigns = await Campaign.find({ brandId: brand._id });

    res.json({ success: true, campaigns });
  } catch (error) {
    console.log("ERROR STACK:", error.stack);
    res.status(500).json({ error: error.message });
  }
};
// ==========================================
// APPROVE CAMPAIGN
// ==========================================

exports.approveCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    campaign.status = "approved";
    campaign.isActive = true;

    await campaign.save();

    global.io.emit("analyticsUpdated");

    const Notification = require("../models/Notification");

    await Notification.create({
      userId: campaign.brandId,
      message: `Your campaign "${campaign.title}" has been approved.`,
    });

    res.json({
      success: true,
      message: "Campaign approved",
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET CAMPAIGN BY ID
// ==========================================

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("brandId", "name email");

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    // ==========================================
    // TRACK CAMPAIGN CLICKS
    // ==========================================

    campaign.clickCount += 1;

    await campaign.save();

    res.json({
      success: true,
      campaign,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching campaign",
    });
  }
};

// ==========================================
// GET AVAILABLE CAMPAIGNS FOR STUDENTS
// ==========================================

exports.getAvailableCampaigns = async (req, res) => {
  try {
    const today = new Date();

    const campaigns = await Campaign.find({
      status: "approved",

      $or: [
        { isActive: true },
        { isActive: { $exists: false } }
      ],

      $and: [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: today } }
          ]
        }
      ]
    }).populate("brandId", "name email");

    res.status(200).json({
      success: true,
      count: campaigns.length,
      campaigns,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching campaigns",
    });
  }
};

// ==========================================
// GET PENDING CAMPAIGNS
// ==========================================

// ==========================================
// GET CAMPAIGNS FOR ADMIN
// ==========================================

exports.getPendingCampaigns =
  async (
    req,
    res,
    next
  ) => {

    try {

      const pendingCampaigns =
        await Campaign.find({

          status: "pending",
        })

        .populate(
          "brandId",
          "name email"
        )

        .sort({
          createdAt: -1,
        });

      const approvedCampaigns =
        await Campaign.find({

          status: "approved",
        })

        .populate(
          "brandId",
          "name email"
        )

        .sort({
          createdAt: -1,
        });

      res.json({

        success: true,

        pendingCampaigns,

        approvedCampaigns,
      });

    } catch (error) {

      next(error);
    }
  };
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    global.io.emit("analyticsUpdated");

    res.json({
      success: true,
      campaign,
    });

  } catch (error) {
    res.status(500).json({ message: "Update error" });
  }
};

exports.getCampaignPerformance = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ brandId: req.user.id });
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    const campaigns = await Campaign.find({ brandId: brand._id });
    const campaignIds = campaigns.map(c => c._id);

    const revenueByCampaign = await BrandTransaction.aggregate([
  { $match: { campaignId: { $in: campaignIds } } }, // Added missing }
  { $group: { _id: "$campaignId", totalRevenue: { $sum: "$brandRevenue" } } } // Added missing }
]); // Added missing ]


    const revenueMap = {};
    revenueByCampaign.forEach(r => {
      revenueMap[r._id.toString()] = r.totalRevenue;
    });

    const performance = campaigns.map((campaign) => ({
      _id: campaign._id,
      campaignTitle: campaign.title,
      clicks: campaign.clickCount || 0,
      conversions: campaign.conversionCount || 0,
      revenue: revenueMap[campaign._id.toString()] || 0,
      ctr: campaign.clickCount > 0
        ? ((campaign.conversionCount / campaign.clickCount) * 100).toFixed(2)
        : 0,
    }));

    res.json({ success: true, performance });
  } catch (error) {
    console.log(error);
    next(error);
  }
};