import axios from "axios";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const baseRequest = async (url: string, method: string, data?: any) => {
    try {
        console.log("URL ->", url);
        console.log("METHOD ->", method);
        console.log("DATA ->", data);

        const token = await AsyncStorage.getItem("accessToken");

        const headers: any = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const config: any = {
            headers: headers,
            url: `${API_URL}${url}`,
            method,
        };

        if (data) {
            if (
                method.toUpperCase() === "GET" ||
                method.toUpperCase() === "DELETE"
            ) {
                config.params = data;
            } else {
                config.data = data;
            }
        }

        const response = await axios(config);
        console.log("==> SUCCESS STATUS:", response.status);
        console.log("==> SUCCESS RESPONSE DATA:", response.data);
        return response.data;
    } catch (error) {
        console.error("==> API REQUEST FAILED <==");
        if (axios.isAxiosError(error)) {
            console.error("Axios error details:");
            console.error("Message:", error.message);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request data:", error.request);
                console.error(
                    "Network Error: No response received. Check API_URL, server status, and internet connection."
                );
            } else {
                console.error("Error config:", error.config);
            }
        } else {
            console.error("Non-Axios error:", error);
        }
        throw error;
    }
};
