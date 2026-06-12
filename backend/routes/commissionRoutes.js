const express = require("express");
const router = express.Router();

const {
  getMyCommissions,
} = require("../controllers/commissionController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Student sees their commissions
router.get(
  "/my",
  protect,
  authorize("student"),
  getMyCommissions
);

module.exports = router;