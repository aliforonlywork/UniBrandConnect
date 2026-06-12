const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Get logged-in user profile
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);

module.exports = router;