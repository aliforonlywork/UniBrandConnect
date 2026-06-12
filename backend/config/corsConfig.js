const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const corsConfig = cors({
  origin: function (origin, callback) {

    if (
      !origin ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error("CORS blocked")
      );
    }
  },

  credentials: true,
});

module.exports = corsConfig;