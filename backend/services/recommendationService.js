const Campaign = require("../models/Campaign");
const UserPreference = require("../models/userPreferenceModel");

// ==========================================
// CALCULATE SIMILARITY
// ==========================================

const calculateSimilarity = (
  userInterests,
  campaignCategory,
  campaignTags
) => {
  let similarityScore = 0;

  // Match category
  if (
    campaignCategory &&
    userInterests.includes(campaignCategory)
  ) {
    similarityScore += 5;
  }

  // Match tags
  if (
    campaignTags &&
    campaignTags.length > 0
  ) {
    const matchedTags = campaignTags.filter(tag =>
      userInterests.includes(tag)
    );

    similarityScore += matchedTags.length;
  }

  return similarityScore;
};

// ==========================================
// CALCULATE FINAL RECOMMENDATION SCORE
// ==========================================

const calculateFinalScore = ({
  similarity,
  engagement,
  clicks,
  conversions,
}) => {

  const score =
    similarity * 0.5 +
    engagement * 0.2 +
    clicks * 0.2 +
    conversions * 0.1;

  return Number(score.toFixed(2));
};

// ==========================================
// GENERATE AI RECOMMENDATIONS
// ==========================================

const generateRecommendations = async (userId) => {
  try {

    // ==========================================
    // GET USER PREFERENCES
    // ==========================================

    const preference =
      await UserPreference.findOne({
        user: userId,
      });

    // Default interests if user new
    const userInterests =
      preference?.interests || [];

    // ==========================================
    // GET ACTIVE APPROVED CAMPAIGNS
    // ==========================================

    const campaigns = await Campaign.find({
      status: "approved",

      $or: [
        { isActive: true },
        { isActive: { $exists: false } }
      ]
    }).populate(
      "brandId",
      "name email"
    );

    // ==========================================
    // SCORE EACH CAMPAIGN
    // ==========================================

    const scoredCampaigns = campaigns.map(
      campaign => {

        // Similarity score
        const similarity =
          calculateSimilarity(
            userInterests,
            campaign.category,
            campaign.tags
          );

        // Engagement score
        const engagement =
          preference?.engagementScore || 0;

        // Popularity
        const clicks =
          campaign.clickCount || 0;

        // Conversion success
        const conversions =
          campaign.conversionCount || 0;

        // Final AI score
        const recommendationScore =
          calculateFinalScore({
            similarity,
            engagement,
            clicks,
            conversions,
          });

        return {
          ...campaign.toObject(),
          recommendationScore,
        };
      }
    );

    // ==========================================
    // SORT BEST RECOMMENDATIONS
    // ==========================================

    scoredCampaigns.sort(
      (a, b) =>
        b.recommendationScore -
        a.recommendationScore
    );

    // ==========================================
    // RETURN TOP 10
    // ==========================================

    return scoredCampaigns.slice(0, 5);

  } catch (error) {
    console.error(
      "AI Recommendation Error:",
      error
    );

    return [];
  }
};

module.exports = {
  generateRecommendations,
};