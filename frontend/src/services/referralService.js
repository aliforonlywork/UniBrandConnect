import API from "./api";

export const getMyReferrals = () =>
  API.get("/referrals");

export const generateReferral = () =>
  API.post("/referrals/generate");