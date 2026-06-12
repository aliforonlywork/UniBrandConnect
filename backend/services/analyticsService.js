/**
 * ==========================================
 * ANALYTICS SERVICE
 * ==========================================
 * Handles:
 * - payment tracking (logging only — DB work is in paymentController)
 * - campaign clicks
 * - conversions
 * - recommendation analytics
 */

const Campaign = require("../models/Campaign");

const Recommendation = require("../models/recommendationModel");

const CampaignAnalytics = require("../models/campaignAnalyticsModel");

// ==========================================
// TRACK PAYMENT
// ==========================================
// NOTE: Transaction and Wallet are written in paymentController.
// This function is intentionally log-only to avoid double writes.

const trackPayment = async ({
  userId,
  campaignId,
  amount,
}) => {
  try {

    console.log(
      "📊 Payment Tracked:",
      {
        userId,
        campaignId,
        amount,
      }
    );

    return true;

  } catch (error) {

    console.error(
      "Payment Tracking Error:",
      error
    );

    return false;
  }
};

// ==========================================
// TRACK CAMPAIGN CLICK
// ==========================================

const trackCampaignClick = async ({
  userId,
  campaignId,
}) => {

  try {

    // =====================================
    // UPDATE CAMPAIGN
    // =====================================

    await Campaign.findByIdAndUpdate(
      campaignId,
      {
        $inc: {
          clickCount: 1,
        },
      }
    );

    // =====================================
    // UPDATE ANALYTICS
    // =====================================

    let analytics =
      await CampaignAnalytics.findOne({
        campaign: campaignId,
      });

    if (!analytics) {

      analytics =
        await CampaignAnalytics.create({
          campaign: campaignId,
          user: userId,
          clicks: 1,
          views: 1,
          clickThroughRate: 100,
        });

    } else {

      analytics.clicks += 1;

      analytics.views += 1;

      // Guard: avoid division by zero
      analytics.clickThroughRate =
        analytics.views > 0
          ? (analytics.clicks / analytics.views) * 100
          : 0;

      analytics.lastInteraction = new Date();

      await analytics.save();
    }

    // =====================================
    // UPDATE RECOMMENDATION
    // =====================================

    await Recommendation.findOneAndUpdate(
      {
        user: userId,
        campaign: campaignId,
      },
      {
        clicked: true,
      }
    );

    console.log("📊 Campaign Click Tracked");

    return true;

  } catch (error) {

    console.error(
      "Click Tracking Error:",
      error
    );

    return false;
  }
};

// ==========================================
// TRACK CONVERSION
// ==========================================

const trackConversion = async ({
  userId,
  campaignId,
}) => {

  try {

    // =====================================
    // UPDATE CAMPAIGN
    // =====================================

    await Campaign.findByIdAndUpdate(
      campaignId,
      {
        $inc: {
          conversionCount: 1,
        },
      }
    );

    // =====================================
    // UPDATE ANALYTICS
    // =====================================

    let analytics =
      await CampaignAnalytics.findOne({
        campaign: campaignId,
      });

    if (!analytics) {

      analytics =
        await CampaignAnalytics.create({
          campaign: campaignId,
          user: userId,
          conversions: 1,
        });

    } else {

      analytics.conversions += 1;

      // Guard: avoid Infinity when clicks is 0
      analytics.conversionRate =
        analytics.clicks > 0
          ? (analytics.conversions / analytics.clicks) * 100
          : 0;

      analytics.lastInteraction = new Date();

      await analytics.save();
    }

    // =====================================
    // UPDATE RECOMMENDATION
    // =====================================

    await Recommendation.findOneAndUpdate(
      {
        user: userId,
        campaign: campaignId,
      },
      {
        converted: true,
        joined: true,
      }
    );

    console.log("📊 Conversion Tracked");

    return true;

  } catch (error) {

    console.error(
      "Conversion Tracking Error:",
      error
    );

    return false;
  }
};

module.exports = {
  trackPayment,
  trackCampaignClick,
  trackConversion,
};