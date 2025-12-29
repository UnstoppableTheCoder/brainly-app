import { BACKEND_URL } from "../constants/constants";
import { useEffect, useState } from "react";
import type { User } from "../types/pages/Profile.type";

export default function useProfile() {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    try {
      const getUserProfile = async () => {
        const response = await fetch(`${BACKEND_URL}/api/v1/users/profile`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error fetching the user profile");
        }

        const result = await response.json();
        if (result.success) {
          if (!isCancelled) setUser(result.data.user);
        } else {
          if (!isCancelled) setError(result.message);
        }
      };

      getUserProfile();
    } catch (error) {
      if (!isCancelled)
        setError(error instanceof Error ? error.message : String(error));
    } finally {
      if (!isCancelled) setIsLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  return { user, isLoading, error };
}
