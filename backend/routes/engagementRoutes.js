const express = require("express");

const router = express.Router();

const {
  trackView,
  trackClick,
  trackJoin,
} = require(
  "../controllers/engagementController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// ==========================================
// TRACK VIEW
// ==========================================

router.post(
  "/view",
  protect,
  trackView
);

// ==========================================
// TRACK CLICK
// ==========================================

router.post(
  "/click",
  protect,
  trackClick
);

// ==========================================
// TRACK JOIN / CONVERSION
// ==========================================

router.post(
  "/join",
  protect,
  trackJoin
);

module.exports = router;