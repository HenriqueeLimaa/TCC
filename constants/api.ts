export const API_URL = "http://167.234.239.154:3000";

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

export enum AchievementRoutes {
    FETCH_GROUPED = "/user-achievements/grouped",
}

export enum VirtualPetRoutes {
    CREATE = "/pet",
    EDIT = "/pet",
    GET = "/pet",
    DELETE = "/pet"
}

export enum UserPatternsRoutes {
    GET_PATTERNS = "/user-pattern/me",
    GET_SUGGESTIONS = "/user-pattern/suggestions",
    GET_IMPROVEMENTS = "/user-pattern/improvements"
}
