import { baseRequest } from "./apiClient";
import { UserPatternsRoutes } from "@/constants/api";

export class UserPatternsService {
    async getPatterns() {
        return await baseRequest(UserPatternsRoutes.GET_PATTERNS, "GET");
    }

    async getSuggestions() {
        return await baseRequest(UserPatternsRoutes.GET_SUGGESTIONS, "GET");
    }

    async getImprovements() {
        return await baseRequest(UserPatternsRoutes.GET_IMPROVEMENTS, "GET");
    }
}