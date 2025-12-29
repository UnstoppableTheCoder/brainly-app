import { useEffect, useState, type ReactNode } from "react";
import { BACKEND_URL } from "../../constants/constants";
import AuthContext from "./AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import axios from "axios";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/users/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("User logged out successfully");
        setIsLoggedIn(false);
        navigate("/");
      } else {
        toast.error("Error logging out the user");
        console.log("Error logging out the user: ", result.data.errors);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("Error fetching the user details: ", error);
        toast.error(error.response.data.message);
        return;
      }

      toast.error(error instanceof Error ? error.message : String(error));
      return;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, isLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
