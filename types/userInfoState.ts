export type UserInfoState = {
  name?: string;
  email?: string;
  password?: string;
  isLoggedIn?: boolean;
  setIsLoggedIn?: (value: boolean) => void;
};