import { createContext, ReactNode, useState } from "react";
import { UserInfoState } from "../types/userInfoState";

const defaultValues: UserInfoState = {
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

export const LoginStateContext = createContext<UserInfoState>(defaultValues);

export const LoginStateProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");

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
