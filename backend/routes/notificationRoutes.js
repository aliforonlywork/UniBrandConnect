const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// Get notifications
router.get("/", protect, getMyNotifications);

// Mark as read
router.patch("/:id", protect, markAsRead);

module.exports = router;