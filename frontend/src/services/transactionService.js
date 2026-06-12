import API from "./api";

export const getAllTransactions = () =>
  API.get("/transactions/all");