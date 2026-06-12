// =======================================
// FRONTEND
// pages/Payment.jsx
// =======================================

//import { loadStripe } from "@stripe/stripe-js";
import { createPaymentSession } from "../services/paymentService";

/*const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PK
);
console.log("Stripe key:", import.meta.env.VITE_STRIPE_PK);//remove */

const Payment = ({
  product,
  studentId,
  campaignId,
  referralId,
}) => {
  const handlePayment = async () => {
    console.log("buy now clicked");
    try {
      const data =
  await createPaymentSession({
    product,
    studentId,
    campaignId,
    referralId,
  });

   window.location.href = data.url;
   
   console.log("Session data:", data);//remove

//const stripe = await stripePromise;

console.log("Stripe instance:", stripe);//remove

await stripe.redirectToCheckout({
  sessionId: data.id,
});

} catch (error) {
  console.log(error);
}
};

  return (
    <div>
      <h2>Buy Product</h2>

      <h3>{product.name}</h3>

      <p>${product.price}</p>

      <button onClick={handlePayment}>
        Buy Now
      </button>
    </div>
  );
};

export default Payment;