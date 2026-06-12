import API from "./api";

export const getAllCampaigns = () => API.get("/campaigns");

export const getCampaignById = (id) =>
  API.get(`/campaigns/${id}`);

export const createCampaign = (data) =>
  API.post("/campaigns", data);

export const updateCampaign = (id, data) =>
  API.put(`/campaigns/${id}`, data);

export const applyToCampaign = (id) =>
  API.post(`/campaigns/${id}/apply`);