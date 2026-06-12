const express = require("express");

const router = express.Router();

const {
  generateReferral,
  trackClick,
  getMyReferrals,
} = require("../controllers/referralController");

const { protect } = require("../middleware/authMiddleware");

// Generate referral
router.post(
  "/generate",
  protect,
  generateReferral
);

// My referrals
router.get(
  "/my",
  protect,
  getMyReferrals
);

// Track click
router.get(
  "/:code",
  trackClick
);

module.exports = router;