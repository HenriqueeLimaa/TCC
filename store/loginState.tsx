import { createContext, ReactNode, useState } from "react";
import {UserInfoState} from "../types/userInfoState";

export const LoginStateContext = createContext<UserInfoState>({
  name: "",
  email: "",
  password: "",
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
});

const LoginStateProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const context = {
    name,
    email,
    password,
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <LoginStateContext.Provider value={context}>
      {children}
    </LoginStateContext.Provider>
  );
};
