const express = require("express");
const router = express.Router();

const {
  getMyTransactions,
  getAllTransactions,
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Student transaction history
router.get(
  "/my",
  protect,
  authorize("student"),
  getMyTransactions
);

// Admin transaction logs
router.get(
  "/all",
  protect,
  authorize("admin"),
  getAllTransactions
);

module.exports = router;