import { baseRequest } from "./apiClient";
import { UserPatternsRoutes } from "@/constants/api";

export interface UserPatternsDto {
    averageCompletionTime: number;
    commonTaskTitles: string[];
    completionPercentage: number;
    mostFrequentCompletionHour: string;
    mostProductiveDays: string[];
}

export interface GetPatternsDto {
    data: UserPatternsDto;
}

export interface GetImprovementsDto {
    data: string;
}

export class UserPatternsService {
    async getPatterns(): Promise<GetPatternsDto> {
        return await baseRequest(UserPatternsRoutes.GET_PATTERNS, "GET");
    }

    async getSuggestions() {
        return await baseRequest(UserPatternsRoutes.GET_SUGGESTIONS, "GET");
    }

    async getImprovements(): Promise<GetImprovementsDto> {
        return await baseRequest(UserPatternsRoutes.GET_IMPROVEMENTS, "GET");
    }
}
