import { LoginStateContext } from "@/store/loginState";
import { useContext } from "react";

export const useLoginState = () => {
    const context = useContext(LoginStateContext);

    if (!context) {
        throw new Error("useLoginState must be used inside of a LoginProvider");
    }

    return context;
};
