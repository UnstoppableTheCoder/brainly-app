import { Navigate, NavLink } from "react-router";
import AuthForm from "../components/auth/AuthForm";
import useAuthContext from "../contexts/auth/useAuthContext";

const AuthPage = () => {
  const { isLoggedIn, isLoading } = useAuthContext();
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center text-3xl font-bold h-screen">
        Loading...
      </div>
    );

  const pathname = window.location.pathname;
  const isSigningUp = pathname === "/signup";

  return (
    <div className="flex justify-center mt-56 w-full">
      <div className="flex flex-col gap-y-5 items-center shadow-md shadow-blue-200 dark:shadow-blue-500 rounded-lg p-5 w-xl ">
        {/* Toggle Buttons */}
        <div className="text-lg font-bold flex bg-linear-to-r from-blue-500 hover:from-cyan-500 to-cyan-500 hover:to-blue-500  rounded-full py-2 px-4 transition-colors duration-500 ease-in-out">
          <NavLink to={"/signup"}>
            <button
              className={`cursor-pointer ${
                isSigningUp && "bg-linear-to-r"
              } from-cyan-400 to-blue-400 text-white w-30 rounded-full py-2`}
            >
              Sign up
            </button>
          </NavLink>
          <NavLink to={"/login"}>
            <button
              className={`cursor-pointer ${
                !isSigningUp && "bg-linear-to-r"
              } from-cyan-400 to-blue-400 text-white w-30 rounded-full py-2`}
            >
              Log in
            </button>
          </NavLink>
        </div>
        {/* Auth Form */}
        <AuthForm isSigningUp={isSigningUp} />
      </div>
    </div>
  );
};

export default AuthPage;
