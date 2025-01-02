import { createContext, ReactNode, useState } from "react";
import { UserInfoState } from "../types/userInfoState";

export const LoginStateContext = createContext<UserInfoState>({
  name: "",
  email: "",
  password: "",
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
  accessToken: "",
});

export const LoginStateProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  const context = {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isLoggedIn,
    setIsLoggedIn,
    accessToken,
    setAccessToken,
  };

  return (
    <LoginStateContext.Provider value={context}>
      {children}
    </LoginStateContext.Provider>
  );
};
