exports.calculateSimilarity = (userInterests, campaignTags) => {
  if (!userInterests || !campaignTags) return 0;

  const matches = userInterests.filter(tag =>
    campaignTags.includes(tag)
  );

  return matches.length / campaignTags.length;
};