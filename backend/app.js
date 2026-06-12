const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

const analyticsRoutes = require("./routes/analyticsRoutes");

const adminRoutes = require("./routes/adminRoutes");

const paymentRoutes = require("./routes/paymentRoutes");

const clickRoutes = require("./routes/clickRoutes");

const limiter = require("./middleware/rateLimiter");

const corsConfig = require("./config/corsConfig");

dotenv.config();

const app = express();

// ==========================================
// CORS
// ==========================================

app.use(corsConfig);

// ==========================================
// STRIPE WEBHOOK
// ==========================================

app.use(
  "/api/payment/webhook",

  express.raw({
    type: "application/json",
  })
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(morgan("dev"));

// ==========================================
// RATE LIMITER
// IMPORTANT: BEFORE ROUTES
// ==========================================

app.use(limiter);

// ==========================================
// STATIC FILES
// ==========================================

app.use(
  "/uploads",

  express.static(
    path.join(__dirname, "uploads")
  )
);

// ==========================================
// ROUTES
// ==========================================

// AUTH
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// USERS
app.use(
  "/api/users",
  require("./routes/userRoutes")
);

// CAMPAIGNS
app.use(
  "/api/campaigns",
  require("./routes/campaignRoutes")
);

// APPLICATIONS
app.use(
  "/api/applications",
  require(
    "./routes/campaignApplicationRoutes"
  )
);

// REFERRALS
app.use(
  "/api/referrals",
  require("./routes/referralRoutes")
);

app.use(
  "/api/clicks",
  clickRoutes
);

// WALLET
app.use(
  "/api/wallet",
  require("./routes/walletRoutes")
);

app.use("/api/brand", require("./routes/walletRoutes"));

// TRANSACTIONS
app.use(
  "/api/transactions",
  require("./routes/transactionRoutes")
);

// ADMIN
app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

// ANALYTICS
app.use(
  "/api/analytics",
  require("./routes/analyticsRoutes")
);

// NOTIFICATIONS
app.use(
  "/api/notifications",
  require("./routes/notificationRoutes")
);

// WITHDRAWALS
app.use(
  "/api/withdrawals",
  require("./routes/withdrawalRoutes")
);

// COMMISSIONS
app.use(
  "/api/commissions",
  require("./routes/commissionRoutes")
);

// ENGAGEMENT
app.use(
  "/api/engagement",
  require("./routes/engagementRoutes")
);

// GAMIFICATION
app.use(
  "/api/gamification",
  require("./routes/gamificationRoutes")
);

// PAYMENT
app.use(
  "/api/payment",
  paymentRoutes
);

// ==========================================
// DEFAULT ROUTE
// ==========================================

app.get("/", (req, res) => {

  res.send(
    "UniBrandConnect API Running..."
  );
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  require("./middleware/errorHandler")
);

app.get(
  "/test-route",
  (req, res) => {
    res.send("TEST WORKING");
  }
);

module.exports = app;