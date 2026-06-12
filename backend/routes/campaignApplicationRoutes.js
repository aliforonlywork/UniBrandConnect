const express = require("express");
const router = express.Router();
const {
  applyToCampaign,
  getCampaignApplicants,
  approveApplication,
} = require("../controllers/campaignApplicationController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Student applies
router.post("/", protect, authorize("student"), applyToCampaign);

// Brand views applicants of their campaign
router.get("/:campaignId", protect, authorize("brand"), getCampaignApplicants);

// Brand approves student
router.patch("/approve/:id", protect, authorize("brand"), approveApplication);

module.exports = router;