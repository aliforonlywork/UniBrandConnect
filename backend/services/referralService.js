const crypto = require("crypto");

exports.generateReferralCode = () => {
  return crypto.randomBytes(4).toString("hex");
};