const Commission = require("../models/Commission");

// Get student commissions
exports.getMyCommissions = async (req, res, next) => {
  try {
    const commissions = await Commission.find({
      studentId: req.user.id,
    }).populate("campaignId", "title");

    res.json({
      success: true,
      commissions,
    });
  } catch (error) {
    next(error);
  }
};