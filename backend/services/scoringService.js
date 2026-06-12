exports.calculateScore = ({
  similarity,
  engagement,
  popularity,
}) => {
  const score =
    similarity * 0.5 +
    engagement * 0.3 +
    popularity * 0.2;

  return Number(score.toFixed(2));
};