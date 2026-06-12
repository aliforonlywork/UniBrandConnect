exports.generateReferralLink = (baseUrl, code) => {
  return `${baseUrl}/api/referrals/r/${code}`;
};