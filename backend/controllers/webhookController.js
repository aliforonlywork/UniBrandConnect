const stripe = require("../config/stripe");
const WalletService = require("../services/walletService");

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // update wallet balance here
    await WalletService.addBalance(session.amount_total / 100);
  }

  res.json({ received: true });
};