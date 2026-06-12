// ==========================================
// CALCULATE INTEREST SIMILARITY
// ==========================================

exports.calculateSimilarity = (
  userInterests = [],
  campaignTags = []
) => {

  // ======================================
  // VALIDATION
  // ======================================

  if (
    !userInterests.length ||
    !campaignTags.length
  ) {

    return 0;
  }

  // ======================================
  // LOWERCASE NORMALIZATION
  // ======================================

  const normalizedUserInterests =
    userInterests.map(
      (item) => item.toLowerCase()
    );

  const normalizedCampaignTags =
    campaignTags.map(
      (item) => item.toLowerCase()
    );

  // ======================================
  // FIND MATCHES
  // ======================================

  const matches =
    normalizedUserInterests.filter(
      (tag) =>
        normalizedCampaignTags.includes(
          tag
        )
    );

  // ======================================
  // SIMILARITY SCORE
  // ======================================

  const similarity =
    matches.length /
    normalizedCampaignTags.length;

  // ======================================
  // RETURN
  // ======================================

  return Number(
    similarity.toFixed(2)
  );
};