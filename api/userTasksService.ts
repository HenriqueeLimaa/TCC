import { baseRequest } from "./apiClient";
import { TaskRoutes } from "@/constants/api";

export interface UserTask {
    id: string;
    title: string;
    description?: string;
    date: string;
    isCompleted: boolean;
    difficultLevel: number;
}

interface FetchTasksForWeekDTO {
    date: string;
}

export class UserTaskService {
    async getTasksForWeek(data: FetchTasksForWeekDTO) {
        return await baseRequest(
            TaskRoutes.FETCH_BY_WEEK,
            "GET",
            undefined,
            data
        );
    }

    async createTask(data: UserTask) {
        return await baseRequest(TaskRoutes.CREATE, "POST", data);
    }

    async editTask(data: UserTask) {
        return await baseRequest(`${TaskRoutes.EDIT}/${data.id}`, "PUT", data);
    }
}
