const express = require("express");
const router = express.Router();

const {
  getStudentAnalytics,
  getCompanyAnalytics,
  getAdminAnalytics,
  getCampaignAnalytics,
  getPlatformAnalytics,
  getBrandRevenue,
} = require("../controllers/analyticsController");

const { protect } = require("../middleware/authMiddleware");

router.get("/student", protect, getStudentAnalytics);
router.get("/company", protect, getCompanyAnalytics);
router.get("/admin", protect, getAdminAnalytics);
router.get("/campaign/:id", protect, getCampaignAnalytics);
router.get("/platform", protect, getPlatformAnalytics);
router.get("/brand-revenue", protect, getBrandRevenue);

module.exports = router;