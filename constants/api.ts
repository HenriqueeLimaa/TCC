export const API_URL = "http://localhost:3000";

export enum UserRoutes {
    REGISTER = "/users",
    ME = "/users/me",
    LOGIN = "/auth/login",
}

export enum TaskRoutes {
    FETCH_BY_WEEK = "/userTasks/byWeek",
    CREATE = "/userTasks",
    EDIT = "/userTasks/update",
}
