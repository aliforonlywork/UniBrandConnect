// =======================================
// routes/paymentRoutes.js
// =======================================

const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

// CREATE CHECKOUT SESSION
router.post(
  "/create-session",
  paymentController.createCheckoutSession
);

// STRIPE WEBHOOK
router.post(
  "/webhook",
  paymentController.handleWebhook
);

module.exports = router;