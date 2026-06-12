const express = require("express");

const router = express.Router();

const {
  approveCampaign,
  getPendingCampaigns,
} = require(
  "../controllers/campaignController"
);

const {
  getAllUsers,
  getAdminStats,
  getAllStudents,
  getBrandsForApproval,
  approveBrand,
  rejectBrand,
} = require(
  "../controllers/adminController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const {
  authorize,
} = require(
  "../middleware/roleMiddleware"
);

// ==========================================
// ADMIN - GET PENDING CAMPAIGNS
// ==========================================

router.get(
  "/campaigns",
  protect,
  authorize("admin"),
  getPendingCampaigns
);

// ==========================================
// ADMIN - APPROVE CAMPAIGN
// ==========================================

router.patch(
  "/campaigns/:id/approve",
  protect,
  authorize("admin"),
  approveCampaign
);

router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

router.get(
  "/admstudentlist",
  protect,
  authorize("admin"),
  getAllStudents
);

// ==========================================
// BRANDS APPROVAL
// ==========================================

router.get(
  "/brands/pending",
  protect,
  authorize("admin"),
  getBrandsForApproval
);

router.put(
  "/brands/:id/approve",
  protect,
  authorize("admin"),
  approveBrand
);

router.put(
  "/brands/:id/reject",
  protect,
  authorize("admin"),
  rejectBrand
);

module.exports = router;