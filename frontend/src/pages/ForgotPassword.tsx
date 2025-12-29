import axios from "axios";
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { BACKEND_URL } from "../constants/constants";
import toast from "react-hot-toast";
import useAuthContext from "../contexts/auth/useAuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/users/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error sending the reset email: ", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
        return;
      }

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
            Forgot Password
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-5 w-full"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
                {isLoading ? "Sending Email..." : "Send Email"}
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

export default ForgotPassword;
