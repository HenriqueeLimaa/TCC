import {
  GET_USER_BY_ID,
  GET_ALL_USERS,
  USER_REGISTER,
  USER_LOGIN,
} from "@/constants/api";
import { baseRequest } from "./apiClient";

export const getUserById = () => baseRequest(GET_USER_BY_ID, "GET");
export const getAllUsers = () => baseRequest(GET_ALL_USERS, "GET");

interface RegisterUserDTO {
  name: string;
  nickname: string;
  email: string;
  password: string;
  birthDate: string;
}

export const registerUser = async (data: RegisterUserDTO) => {
  return await baseRequest(USER_REGISTER, "POST", data);
};

interface UserRegisterDTO {
  email: string;
  password: string;
}

export const userLogin = async (data: UserRegisterDTO) => {
  return await baseRequest(USER_LOGIN, "POST", data);
};
