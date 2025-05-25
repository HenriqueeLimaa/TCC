import { UserRoutes } from "@/constants/api";
import { baseRequest } from "./apiClient";

interface RegisterUserDTO {
    name: string;
    nickname: string;
    email: string;
    password: string;
    birthDate: string;
}

interface UserRegisterDTO {
    email: string;
    password: string;
}

interface UpdateUserDTO {
    name: string;
    nickname: string;
    birthDate: string;
}

export class UserService {
    async registerUser(data: RegisterUserDTO) {
        return await baseRequest(UserRoutes.REGISTER, "POST", data);
    }

    async userLogin(data: UserRegisterDTO) {
        return await baseRequest(UserRoutes.LOGIN, "POST", data);
    }

    async fetchLoggedUser() {
        return await baseRequest(UserRoutes.ME, "GET");
    }

    async update(data: UpdateUserDTO) {
        return await baseRequest(UserRoutes.ME, "PUT", data);
    }
}
