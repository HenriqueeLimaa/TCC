import { baseRequest } from "./apiClient";
import { TaskRoutes } from "@/constants/api";

export interface UserTask {
    id: string;
    title: string;
    description?: string;
    date: string;
    isCompleted: boolean;
    difficultyLevel: number;
}

interface FetchTasksForWeekDTO {
    date: string;
}

export class UserTaskService {
    async getTasksForWeek(data: FetchTasksForWeekDTO) {
        return await baseRequest(TaskRoutes.FETCH_BY_WEEK, "GET", data);
    }
}
