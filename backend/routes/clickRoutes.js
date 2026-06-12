const express = require("express");

const router = express.Router();

const {
  getMyClicks,
} = require(
  "../controllers/clickController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router.get(
  "/",
  protect,
  getMyClicks
);

module.exports = router;