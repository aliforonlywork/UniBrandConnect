const express = require("express");
const router = express.Router();

const {
  getRecommendations,
} = require("../controllers/recommendationController");

// GET AI recommendations
router.get("/", getRecommendations);

module.exports = router;