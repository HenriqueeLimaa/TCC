import { AchievementRoutes } from "@/constants/api";
import { baseRequest } from "./apiClient";

interface AchievementDTO {
    id: string;
    achievementId?: string;
    unlockedAt: string;
    name: string;
    description: string;
}

interface FetchAchievementsDTO {
    unlocked: AchievementDTO[];
    blocked: AchievementDTO[];
}

export class AchievementsService {
    async fetchAchievements(): Promise<{ data: FetchAchievementsDTO }> {
        return baseRequest(AchievementRoutes.FETCH_GROUPED, "GET");
    }
}
