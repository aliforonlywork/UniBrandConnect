const express = require("express");
const router = express.Router();

const {
  simulateSale,
  getWallet,
} = require("../controllers/walletController");

const {
  getBrandWallet,
  getBrandTransactions
} = require("../controllers/brandController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Admin simulates sale
router.post(
  "/simulate-sale",
  protect,
  authorize("admin"),
  simulateSale
);

// Student checks wallet
router.get(
  "/my-wallet",
  protect,
  authorize("student"),
  getWallet
);

router.get(
  "/brand/wallet",
  protect,
  authorize("brand"),
  getBrandWallet
);

router.get(
  "/brand/transactions",
  protect,
  authorize("brand"),
  getBrandTransactions
);

module.exports = router;