const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // limit each IP
  message: "Too many requests from this IP",
});

module.exports = limiter;

//npm install express-rate-limit