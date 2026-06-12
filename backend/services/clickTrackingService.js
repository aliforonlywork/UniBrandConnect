const Click = require("../models/Click");
const Referral = require("../models/Referral");

exports.trackClick = async (referral, req) => {
  referral.totalClicks += 1;
  await referral.save();

  await Click.create({
    referralId: referral._id,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });
};