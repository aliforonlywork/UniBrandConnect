const Campaign = require("../models/Campaign");

// ==========================================
// CREATE CAMPAIGN
// ==========================================

exports.createCampaign = async (data) => {
  return await Campaign.create(data);
};

// ==========================================
// GET APPROVED CAMPAIGNS
// ==========================================

exports.getApprovedCampaigns = async () => {
  return await Campaign.find({
    status: "approved",
  });
};

// ==========================================
// GET ACTIVE CAMPAIGNS
// ==========================================

exports.getActiveCampaigns = async () => {
  return await Campaign.find({
    status: "approved",
    isActive: true,
  });
};

// ==========================================
// INCREMENT CLICK COUNT
// ==========================================

exports.incrementClickCount = async (campaignId) => {
  return await Campaign.findByIdAndUpdate(
    campaignId,
    {
      $inc: {
        clickCount: 1,
      },
    },
    { new: true }
  );
};

// ==========================================
// INCREMENT CONVERSION COUNT
// ==========================================

exports.incrementConversionCount = async (campaignId) => {
  return await Campaign.findByIdAndUpdate(
    campaignId,
    {
      $inc: {
        conversionCount: 1,
      },
    },
    { new: true }
  );
};