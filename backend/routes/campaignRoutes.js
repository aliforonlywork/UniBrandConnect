// routes/campaignRoutes.js

const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  createCampaign,
  getAllCampaigns,
  getBrandCampaigns,
  approveCampaign,
  getCampaignById,
  getAvailableCampaigns,
  updateCampaign,
  getCampaignPerformance,
} = require("../controllers/campaignController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ==========================================
// STUDENT ROUTES
// ==========================================

// Get available approved campaigns for students
// FINAL URL:
// /api/campaigns/student/campaigns
router.get(
  "/student/campaigns",
  protect,
  getAvailableCampaigns
);

// ==========================================
// RECOMMENDED CAMPAIGNS ROUTE
// ==========================================

const {
  getRecommendations,
} = require("../controllers/recommendationController");

// FINAL URL:
// /api/campaigns/student/recommendations

router.get(
  "/student/recommendations",
  protect,
  getRecommendations
);

// ==========================================
// GENERAL CAMPAIGNS
// ==========================================

// Get all approved campaigns
router.get(
  "/",
  protect,
  getAllCampaigns
);

// ==========================================
// BRAND ROUTES
// ==========================================

// Brand creates campaign
router.post(
  "/",
  protect,
  authorize("brand"),
  upload.single("image"),
  createCampaign
);

// Brand views own campaigns
router.get(
  "/my",
  protect,
  authorize("brand"),
  getBrandCampaigns
);

router.put(
  "/:id",
  protect,
  authorize("brand"),
  updateCampaign
);

router.get(
  "/performance",
  protect,
  authorize("brand"),
  getCampaignPerformance
);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Admin approves campaign
router.patch(
  "/approve/:id",
  protect,
  authorize("admin"),
  approveCampaign
);

// ==========================================
// SINGLE CAMPAIGN
// IMPORTANT: KEEP LAST
// ==========================================

router.get(
  "/:id",
  getCampaignById
);

module.exports = router;