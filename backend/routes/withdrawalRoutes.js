const express = require("express");
const router = express.Router();

const {
  requestWithdrawal,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} = require("../controllers/withdrawalController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Student requests withdrawal
router.post("/", protect, authorize("student"), requestWithdrawal);

// Admin views all withdrawals
router.get("/", protect, authorize("admin"), getAllWithdrawals);

// Admin approves
router.patch(
  "/approve/:id",
  protect,
  authorize("admin"),
  approveWithdrawal
);

// Admin rejects
router.patch(
  "/reject/:id",
  protect,
  authorize("admin"),
  rejectWithdrawal
);

module.exports = router;