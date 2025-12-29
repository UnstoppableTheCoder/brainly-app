import { useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import useAuthContext from "../contexts/auth/useAuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../constants/constants";

const ResetPassword = () => {
  const { hash } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwords.newPassword || !passwords.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Password do not match");
      setPasswords({
        newPassword: "",
        confirmPassword: "",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/users/reset-password/${hash}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwords),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        navigate("/login");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log("Error sending the reset email: ", error);
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle =
    "border-2 placeholder:text-blue-400 text-blue-500 rounded-md outline-none border px-2 text-xl py-1 focus:ring-2 focus:ring-cyan-500 focus:border-blue-100";

  return (
    <div className="flex-1 items-center flex justify-center flex-col">
      <div className="w-xl px-6">
        <div className="flex flex-col gap-y-8 items-center shadow-md shadow-blue-200 dark:shadow-blue-500 rounded-lg p-5 w-full">
          <h1 className="text-3xl font-bold text-center bg-linear-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            Reset Your Password
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-5 w-full"
          >
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className={inputStyle}
            />

            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm Password"
              className={inputStyle}
            />

            <div className="flex gap-5">
              <button
                type="submit"
                disabled={isLoading}
                className={`text-lg bg-linear-to-r ${
                  isLoading
                    ? "from-blue-300 to-cyan-300 cursor-not-allowed"
                    : "from-blue-500 hover:from-cyan-500 to-cyan-500 hover:to-blue-500"
                }  py-2 px-4 rounded-md text-white cursor-pointer transition-colors duration-200 ease-in-out`}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => navigate("/login")}
                className={`text-lg bg-linear-to-r py-2 from-cyan-500 hover:from-blue-500 to-blue-500 hover:to-cyan-500 px-4 rounded-md text-white cursor-pointer transition-colors duration-200 ease-in-out`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
