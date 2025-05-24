import axios from "axios";
import { API_URL } from "@/constants/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = "token";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

export const baseRequest = async (url: string, method: string, data?: any) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
    });
    if (response.status === 200) {
      console.log("==> RESPONSE: ", response.data);
    }

    return response.data;
  } catch (error) {
    console.log("==> ERROR: ", error);
  }
};
