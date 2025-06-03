import { baseRequest } from "./apiClient";
import { VirtualPetRoutes } from "@/constants/api";

interface VirtualPet {
    id: string;
    name: string;
}

export class VirtualPetService {
  async createPet(data: any) {
    return await baseRequest(VirtualPetRoutes.CREATE, "POST", data);
  }

  async editPet(data: VirtualPet) {
    return await baseRequest(
      `${VirtualPetRoutes.EDIT}/${data.id}`,
      "PUT",
      data
    );
  }

  async getPet() {
    return await baseRequest(VirtualPetRoutes.GET, "GET");
  }

  async deletePet(id: string) {
    return await baseRequest(`${VirtualPetRoutes.DELETE}/${id}`, "DELETE");
  }
}
