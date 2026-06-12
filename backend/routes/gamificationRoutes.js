const express = require("express");

const router = express.Router();

const {
  getLeaderboard,
  getMyGamification,
} = require(
  "../controllers/gamificationController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router.get(
  "/leaderboard",
  getLeaderboard
);

router.get(
  "/me",
  protect,
  getMyGamification
);

module.exports = router;