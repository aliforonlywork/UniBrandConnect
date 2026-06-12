import API from "./api";

export const getWallet = () => API.get("/wallet");

export const getTransactions = () =>
  API.get("/wallet/transactions");