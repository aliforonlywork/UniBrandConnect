const Click = require("../models/Click");

// GET MY CLICK HISTORY
const mongoose = require('mongoose');

exports.getMyClicks = async (req, res, next) => {
  try {
    const clicks = await Click.find()
      .populate({
        path: "referralId",
        populate: {
          path: "campaignId",
          select: "title",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      clicks, // no filter = shows all 88
      total: clicks.length
    });
  } catch (error) {
    next(error);
  }
};

// controllers/clickController.js
exports.getDashboardStats = async (req, res) => {
  const totalClicks = await Click.countDocuments(); // 53
  res.json({ totalClicks });
};