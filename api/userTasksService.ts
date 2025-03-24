import { REGISTER_TASK, GET_TASKS_BY_USER_ID, EDIT_TASK, DELETE_TASK, GET_USER_TASKS_BY_DATE } from "@/constants/api";
import { baseRequest } from "./apiClient";

export const registerTask = () => baseRequest(REGISTER_TASK, "POST");
export const getTasksByUserId = (userId: string) => baseRequest(GET_TASKS_BY_USER_ID, "GET", userId);
export const editTask = (taskId: string, taskData: Object) => baseRequest(EDIT_TASK, "PUT", taskId);
export const deleteTask = (taskId: string) => baseRequest(DELETE_TASK, "DELETE", taskId);
// check if the parameter is correct
export const getUserTasksByDate = (week: number) => baseRequest(GET_USER_TASKS_BY_DATE, "GET", week);