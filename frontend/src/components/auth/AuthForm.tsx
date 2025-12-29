import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { BACKEND_URL } from "../../constants/constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import useAuthContext from "../../contexts/auth/useAuthContext";

const AuthForm = ({ isSigningUp }: { isSigningUp: boolean }) => {
  const [authPayload, setAuthPayload] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuthContext();

  const inputStyle =
    "border-2 placeholder:text-blue-400 text-blue-500 rounded-md outline-none border px-2 text-xl py-1 focus:ring-2 focus:ring-cyan-500 focus:border-blue-100";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, password, confirmPassword } = authPayload;

    if (isSigningUp) {
      if (!name || !email || !password || !confirmPassword) {
        toast.error("All fields are required");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords don't match");
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/v1/users/signup`,
          { name, email, password, confirmPassword },
          { headers: { "Content-Type": "application/json" } }
        );

        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/login"); // Signup → login flow
        } else {
          toast.error(res.data.message);
        }
      } catch (error: unknown) {
        handleError(error);
      }
    } else {
      if (!email || !password) {
        toast.error("Email and password required");
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/v1/users/login`,
          { email, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          toast.success(res.data.message);
          setIsLoggedIn(true);
          navigate("/");
        } else {
          toast.error(res.data.message);
        }
      } catch (error: unknown) {
        handleError(error);
      }
    }

    // ✅ Reset ONLY after success
    setAuthPayload({ name: "", email: "", password: "", confirmPassword: "" });
    setIsLoading(false);
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthPayload((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-y-3">
      <input
        type="text"
        placeholder="Your Name"
        name="name"
        className={`${inputStyle} ${isSigningUp ? "block" : "hidden"}`}
        onChange={handleChange}
        value={authPayload.name}
        required={isSigningUp}
      />
      <input
        type="email"
        placeholder="example@gmail.com"
        name="email"
        className={`${inputStyle}`}
        onChange={handleChange}
        value={authPayload.email}
        required
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        className={inputStyle}
        onChange={handleChange}
        value={authPayload.password}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        className={`${inputStyle} ${isSigningUp ? "block" : "hidden"}`}
        onChange={handleChange}
        value={authPayload.confirmPassword}
        required={isSigningUp}
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`text-lg bg-linear-to-r ${
          isLoading
            ? "from-blue-300 to-cyan-300 cursor-not-allowed"
            : "from-blue-500 hover:from-cyan-500 to-cyan-500 hover:to-blue-500"
        }  py-2 rounded-md text-white cursor-pointer transition-colors duration-200 ease-in-out`}
      >
        {isSigningUp
          ? isLoading
            ? "Signing up..."
            : "Sign up"
          : isLoading
          ? "Logging in..."
          : "Log in"}
      </button>

      {!isSigningUp && (
        <a
          href="/forgot-password"
          className="text-blue-600 hover:underline transition-all duration-100 hover:text-blue-500"
        >
          Forgot Password?
        </a>
      )}
    </form>
  );
};

export default AuthForm;
