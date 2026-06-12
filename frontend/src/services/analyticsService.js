import API from "./api";

export const getPlatformAnalytics = () =>
  API.get("/analytics/platform");

export const getCampaignAnalytics = (id) =>
  API.get(`/analytics/campaign/${id}`);