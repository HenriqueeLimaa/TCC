// This is the base url to test it on android. It might be different for ios or web.
export const API_URL = 'http://10.0.2.2:3000';

// USERS
export const USER_REGISTER = '/users';
export const GET_USER_BY_ID = `/users`;
export const GET_ALL_USERS = '/users';

// User tasks
export const REGISTER_TASK = '/userTasks';
export const GET_TASKS_BY_USER_ID = '/userTasks/all/';  // eg: /userTasks/all/1/1
export const EDIT_TASK = '/userTasks/update/';  // eg: /userTasks/update/404e1156-f5a7-4758-b52a-bacffbe2e55f
export const DELETE_TASK = '/userTasks/update/' // eg: /userTasks/update/1
export const GET_USER_TASKS_BY_DATE = '/userTasks/byWeek/' // eg: /userTasks/byWeek/1