const Notification = require("../models/Notification");

exports.createNotification = async (userId, message) => {
  return await Notification.create({
    userId,
    message,
  });
};