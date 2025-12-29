import type { Dispatch, SetStateAction } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  logout: () => void;
}
