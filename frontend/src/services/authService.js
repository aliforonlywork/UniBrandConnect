import API from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const loginUser = async (data) => {
  return API.post(API_ENDPOINTS.LOGIN, data);
};

export const registerUser = async (data) => {
  return API.post(API_ENDPOINTS.REGISTER, data);
};

export const getProfile = async () => {
  return API.get(API_ENDPOINTS.PROFILE);
};