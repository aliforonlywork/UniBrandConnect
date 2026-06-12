import API from "./api";

export const getCommissionSettings = () =>
  API.get("/commission");

export const updateCommission = (data) =>
  API.put("/commission", data);