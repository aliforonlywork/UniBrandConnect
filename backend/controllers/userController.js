const User = require("../models/User");

// Get Profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);
    user.name = name || user.name;

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};