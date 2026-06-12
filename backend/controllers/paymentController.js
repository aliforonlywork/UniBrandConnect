// =======================================
// controllers/paymentController.js
// =======================================
const Campaign = require("../models/Campaign");

const stripe = require("../config/stripe");

const Order = require("../models/Order");

const commissionService = require("../services/commissionService");

const Transaction = require("../models/Transaction");

const walletService = require("../services/walletService");

const notificationService = require("../services/notificationService");

const analyticsService = require("../services/analyticsService");


// =======================================
// CREATE CHECKOUT SESSION
// =======================================

exports.createCheckoutSession =
  async (req, res) => {

    try {

      const {
        product,
        studentId,
        campaignId,
        referralId,
      } = req.body;

      const session =
        await stripe.checkout.sessions.create({

          payment_method_types: ["card"],

          line_items: [
            {
              price_data: {

                currency: "usd",

                product_data: {
                  name: product.name,
                },

                unit_amount:
                  product.price * 100,
              },

              quantity: 1,
            },
          ],

          mode: "payment",

          metadata: {
  studentId,
  campaignId, 
  referralId:'6a21716878244ac0243f1554', // your referral _id from logs
  productId: product._id,
},

          success_url:
            "http://localhost:5173/payment-success",

          cancel_url:
            "http://localhost:5173/payment-cancel",
        });

      // =======================================
      // RETURN STRIPE HOSTED URL
      // =======================================

      res.json({
        url: session.url,
      });

    } catch (error) {

      console.log(
        "Stripe Session Error:",
        error
      );

      res.status(500).json({
        message:
          "Payment session failed",
      });

    }
  };

// =======================================
// HANDLE WEBHOOK
// =======================================

exports.handleWebhook =
  async (req, res) => {

    const sig =
      req.headers["stripe-signature"];

    let event;

    try {

      event =
        stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env
            .STRIPE_WEBHOOK_SECRET
        );

    } catch (err) {

      console.log(
        "Webhook Error:",
        err.message
      );

      return res
        .status(400)
        .send("Webhook Error");
    }

    // =======================================
    // PAYMENT SUCCESS
    // =======================================

    console.log("📦 Stripe Event Type:", event.type);

    if (
      event.type ===
      "checkout.session.completed"
    ) {

      const session =
        event.data.object;

      const {
        studentId,
        campaignId,
        referralId,
        productId,
      } = session.metadata;

      const amountPaid = session.amount_total / 100;

      console.log("Metadata received:", { studentId, campaignId, referralId, productId });


      try {

        // =======================================
        // GUARD — skip if metadata missing
        // =======================================

        if (
          !studentId ||
          studentId === "undefined" ||
          !referralId ||
          referralId === "undefined"
        ) {
          console.log(
            "❌ Missing metadata — studentId or referralId is undefined. Skipping."
          );
          return res.json({ received: true });
        }

        // =======================================
        // PREVENT DUPLICATES
        // =======================================

        const existingOrder =
          await Order.findOne({
            stripeSessionId: session.id,
          });

        if (existingOrder) {
          return res.json({ received: true });
        }

        // =======================================
        // SAVE ORDER
        // =======================================

        const order = await Order.create({
          customerEmail: session.customer_details?.email,
          studentId,
          campaignId,
          referralId,
          productId,
          stripeSessionId: session.id,
          amountPaid,
          paymentStatus: "paid",
        });

        // =======================================
// CALCULATE COMMISSION
// =======================================
const commissionAmount = await commissionService.calculateCommission(
  campaignId,
  amountPaid
);

// =======================================
// SAVE COMMISSION
// =======================================
await commissionService.createCommission({
  studentId,
  campaignId,
  referralId,
  orderId: order._id,
  amount: commissionAmount, // ← was 'commission'
});

console.log("About to create transaction:", { 
  studentId, // ← was 'user'
  campaignId, 
  commissionAmount 
});

// =======================================
// SAVE TRANSACTION
// =======================================
const txn = await Transaction.create({
  studentId: studentId,
  campaignId: campaignId,
  commissionAmount: commissionAmount,
  type: "credit",
  status: "success",
});

console.log("Transaction created:", txn._id);

// =======================================
// UPDATE WALLET
// =======================================
await walletService.creditWallet(
  studentId,
  commissionAmount // ← was 'commission'
);


// =======================================
// UPDATE BRAND WALLET - ADD THIS BLOCK ↓↓
// =======================================
const BrandWallet = require("../models/BrandWallet");
const BrandTransaction = require("../models/BrandTransaction");

const campaign = await Campaign.findById(campaignId);
const brandRevenue = amountPaid - commissionAmount;

const updatedWallet = await BrandWallet.findOneAndUpdate(
  { brandId: campaign.brandId }, // 6a22b1b35f5e41808b14d35d
  {
    $inc: {
      totalRevenue: brandRevenue,
      totalGMV: amountPaid,
      totalPaidToStudents: commissionAmount
    }
  },
  { upsert: true, new: true }
);

console.log("=== BRAND WALLET UPDATE ===");
console.log("brandId:", campaign.brandId);
console.log("brandRevenue:", brandRevenue);
console.log("Updated wallet:", updatedWallet);

await BrandTransaction.create({
  brandId: campaign.brandId,
  campaignId: campaignId,
  referralId: referralId,
  orderId: order._id,
  productPrice: amountPaid,
  commissionAmount: commissionAmount,
  brandRevenue: brandRevenue
});

// =======================================
// UPDATE ANALYTICS
// =======================================
await analyticsService.trackPayment({
  userId: studentId,
  campaignId: campaignId,
  amount: commissionAmount, // ← was 'commission'
});

await analyticsService.trackConversion({
  userId: studentId,
  campaignId: campaignId,
});

// =======================================
// SEND NOTIFICATION
// =======================================
await notificationService.sendNotification(
  studentId,
  `You earned $${commissionAmount} commission!` // ← was 'commission'
);

        console.log("✅ Payment Success");

        global.io.emit("analyticsUpdated");

      } catch (error) {

        console.log(
          "Webhook Processing Error:",
          error
        );

      }
    }

    res.json({ received: true });
  };