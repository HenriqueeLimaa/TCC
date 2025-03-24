import { GET_USER_BY_ID, GET_ALL_USERS, USER_REGISTER } from "@/constants/api";
import { baseRequest } from "./apiClient";

export const getUserById = () => baseRequest(GET_USER_BY_ID, "GET");
export const getAllUsers = () => baseRequest(GET_ALL_USERS, "GET");
export const registerUser = (userData: Object) =>
  baseRequest(USER_REGISTER, "POST", userData);
