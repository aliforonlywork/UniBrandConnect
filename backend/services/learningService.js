const UserPreference = require("../models/userPreferenceModel");

exports.updateEngagement = async (userId, action) => {
  const pref = await UserPreference.findOne({ user: userId });

  if (!pref) return;

  let increment = 0;

  if (action === "click") increment = 2;
  if (action === "join") increment = 5;
  if (action === "view") increment = 1;

  pref.engagementScore += increment;
  await pref.save();
};