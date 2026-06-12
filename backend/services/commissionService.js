const Campaign = require("../models/campaign");
const Commission = require("../models/commission");

exports.calculateCommission = async (campaignId, amount) => {

  const campaign = await Campaign.findById(campaignId);

  // =====================================
  // NULL GUARD
  // =====================================

  if (!campaign) {
    console.log("❌ Campaign not found for id:", campaignId);
    return 0;
  }

  if (!campaign.commissionRate) {
    console.log("❌ Campaign has no commissionRate:", campaign.commissionRate);
    return 0;
  }

  // =====================================
  // CALCULATE
  // =====================================

  return (amount * campaign.commissionRate) / 100;
};

exports.createCommission = async (data) => {
  return await Commission.create({
    student: data.studentId,
    campaign: data.campaignId,
    referral: data.referralId,
    amount: data.amount,
    status: "earned"
  });
};