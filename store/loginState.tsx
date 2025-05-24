import React, { createContext, ReactNode, useState, useEffect } from "react";
import { AuthState } from "../types/auth";

const defaultValues: AuthState = {
    username: "",
    setUsername: () => {},
    name: "",
    setName: () => {},
    email: "",
    setEmail: () => {},
    password: "",
    setPassword: () => {},
    accessToken: "",
    setAccessToken: () => {},
};

export const LoginStateContext = createContext<AuthState>(defaultValues);

export const LoginStateProvider = ({
    children,
    initialAccessToken = "",
}: {
    children: ReactNode;
    initialAccessToken?: string | null;
}) => {
    const [username, setUsername] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>(
        initialAccessToken || ""
    );

    useEffect(() => {
        if (initialAccessToken) {
            setAccessToken(initialAccessToken);
        }
    }, [initialAccessToken]);

    const context = {
        username,
        setUsername,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        accessToken,
        setAccessToken,
    };
    return (
        <LoginStateContext.Provider value={context}>
            {children}
        </LoginStateContext.Provider>
    );
};
