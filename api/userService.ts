import apiClient from "./apiClient";
import { GET_USER_BY_ID, GET_ALL_USERS, USER_REGISTER } from "@/constants/api";

const baseRequest = async (url: string, method: string, data?: any) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
    });
    // logging the response just for now
    if (response.status === 200) {
      console.log('==> RESPONSE: ', response.data);
    }

    return response.data;
  } catch (error) {
    console.log('==> ERROR: ', error);
  }
};

export const getUserById = () => baseRequest(GET_USER_BY_ID, "GET");
export const getAllUsers = () => baseRequest(GET_ALL_USERS, "GET");
export const registerUser = (userData: Object) =>
  baseRequest(USER_REGISTER, "POST", userData);
