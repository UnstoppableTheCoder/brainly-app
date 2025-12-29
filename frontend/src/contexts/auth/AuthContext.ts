import { createContext } from "react";
import type { AuthContextType } from "../../types/contexts/auth/auth.type";

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  isLoading: true,
  logout: () => {},
});

export default AuthContext;
