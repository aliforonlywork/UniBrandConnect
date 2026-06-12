const Campaign = require(
  "../models/Campaign"
);

const engagementService = require(
  "../services/engagementService"
);

const analyticsService = require(
  "../services/analyticsService"
);

// ==========================================
// TRACK VIEW
// ==========================================

exports.trackView = async (
  req,
  res
) => {

  try {

    const {
      campaignId,
      category,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!campaignId) {

      return res.status(400).json({
        success: false,
        message:
          "Campaign ID is required",
      });
    }

    // ======================================
    // FIND CAMPAIGN
    // ======================================

    const campaign =
      await Campaign.findById(
        campaignId
      );

    if (!campaign) {

      return res.status(404).json({
        success: false,
        message:
          "Campaign not found",
      });
    }

    // ======================================
    // UPDATE VIEW COUNT
    // ======================================

    campaign.viewCount =
      (campaign.viewCount || 0) + 1;

    await campaign.save();

    // ======================================
    // UPDATE ENGAGEMENT
    // ======================================

    await engagementService.updateEngagement(
      req.user.id,
      "view",
      category || campaign.category
    );

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({

      success: true,

      message:
        "View tracked successfully",
    });

  } catch (error) {

    console.error(
      "Track View Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to track view",
    });
  }
};

// ==========================================
// TRACK CLICK
// ==========================================

exports.trackClick = async (
  req,
  res
) => {

  try {

    const {
      campaignId,
      category,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!campaignId) {

      return res.status(400).json({
        success: false,
        message:
          "Campaign ID is required",
      });
    }

    // ======================================
    // TRACK CLICK ANALYTICS
    // ======================================

    await analyticsService.trackCampaignClick(
      {
        userId: req.user.id,
        campaignId,
      }
    );

    // ======================================
    // UPDATE ENGAGEMENT
    // ======================================

    await engagementService.updateEngagement(
      req.user.id,
      "click",
      category
    );

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({

      success: true,

      message:
        "Click tracked successfully",
    });

  } catch (error) {

    console.error(
      "Track Click Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to track click",
    });
  }
};

// ==========================================
// TRACK JOIN / CONVERSION
// ==========================================

exports.trackJoin = async (
  req,
  res
) => {

  try {

    const {
      campaignId,
      category,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!campaignId) {

      return res.status(400).json({
        success: false,
        message:
          "Campaign ID is required",
      });
    }

    // ======================================
    // TRACK CONVERSION
    // ======================================

    await analyticsService.trackConversion(
      {
        userId: req.user.id,
        campaignId,
      }
    );

    // ======================================
    // UPDATE ENGAGEMENT
    // ======================================

    await engagementService.updateEngagement(
      req.user.id,
      "join",
      category
    );

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({

      success: true,

      message:
        "Join tracked successfully",
    });

  } catch (error) {

    console.error(
      "Track Join Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to track join",
    });
  }
};