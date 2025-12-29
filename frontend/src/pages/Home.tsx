import { NavLink } from "react-router";
import useAuthContext from "../contexts/auth/useAuthContext";

const Home = () => {
  const { isLoggedIn } = useAuthContext();

  const buttonStyle =
    "px-10 text-lg bg-linear-to-r py-2 rounded-md text-white cursor-pointer transition-colors duration-200 ease-in-out";

  return (
    <div className="flex h-full items-center justify-center flex-col space-y-10 max-w-6xl mx-auto shadow-lg shadow-gray-300 dark:shadow-blue-400 flex-1 w-full rounded-lg p-5">
      <h1 className="text-5xl font-bold text-center bg-linear-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
        Keep your links in your Second Brain
      </h1>

      <div className="flex flex-col items-center">
        {isLoggedIn ? (
          <NavLink to={"/contents"}>
            <button
              className={`${buttonStyle} from-blue-500 hover:from-cyan-500 to-cyan-500 hover:to-blue-500`}
            >
              Get Started
            </button>
          </NavLink>
        ) : (
          <div className="flex gap-5">
            <NavLink to={"/signup"}>
              <button
                className={`${buttonStyle} from-blue-500 hover:from-cyan-500 to-cyan-500 hover:to-blue-500`}
              >
                Sign up
              </button>
            </NavLink>

            <NavLink to={"/login"}>
              <button
                className={`${buttonStyle} from-cyan-500 hover:from-blue-500 to-blue-500 hover:to-cyan-500`}
              >
                Log in
              </button>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
