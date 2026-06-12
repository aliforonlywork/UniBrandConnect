const recommendationService = require(
  "../services/recommendationService"
);

const Recommendation = require(
  "../models/recommendationModel"
);

/**
 * ==========================================
 * GET AI RECOMMENDATIONS
 * ==========================================
 */

const getRecommendations = async (
  req,
  res
) => {
  try {

    // ==========================================
    // GET LOGGED IN USER
    // ==========================================

    const userId = req.user
      ? req.user.id
      : null;

    // ==========================================
    // GENERATE RECOMMENDATIONS
    // ==========================================

    const recommendations =
      await recommendationService.generateRecommendations(
        userId
      );

    // ==========================================
    // SAVE RECOMMENDATIONS
    // ==========================================

    if (
      userId &&
      recommendations.length > 0
    ) {

      await Recommendation.deleteMany({
        user: userId,
      });

      const recommendationDocs =
        recommendations.map((campaign) => ({

          user: userId,

          campaign: campaign._id,

          // FIXED HERE
          score:
            campaign.recommendationScore || 0,

          reason: "AI Suggested",
        }));

      await Recommendation.insertMany(
        recommendationDocs
      );
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,

      count: recommendations.length,

      campaigns: recommendations,
    });

  } catch (error) {

    console.error(
      "Recommendation Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate recommendations",
    });
  }
};

module.exports = {
  getRecommendations,
};