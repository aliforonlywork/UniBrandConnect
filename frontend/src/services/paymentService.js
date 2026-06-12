// =======================================
// FRONTEND
// services/paymentService.js
// =======================================

import api from "./api";

export const createPaymentSession = async (
  paymentData
) => {
  const res = await api.post(
    "/payment/create-session",
    paymentData
  );

  return res.data;
};