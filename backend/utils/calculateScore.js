// ==========================================
// CALCULATE AI RECOMMENDATION SCORE
// ==========================================

exports.calculateScore = ({
  similarity = 0,
  engagement = 0,
  popularity = 0,
  conversionRate = 0,
}) => {

  // ======================================
  // WEIGHTED SCORE
  // ======================================

  const score =

    // Interest similarity
    similarity * 0.4 +

    // User engagement
    engagement * 0.3 +

    // Campaign popularity
    popularity * 0.2 +

    // Conversion performance
    conversionRate * 0.1;

  // ======================================
  // RETURN FINAL SCORE
  // ======================================

  return Number(
    score.toFixed(2)
  );
};