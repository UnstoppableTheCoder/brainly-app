import SideBar from "../components/content/SideBar";
import Cards from "../components/content/Cards";
import { Navigate } from "react-router";
import useAuthContext from "../contexts/auth/useAuthContext";

const Content = ({ needsLogIn }: { needsLogIn: boolean }) => {
  const { isLoggedIn, isLoading } = useAuthContext();
  if (needsLogIn) {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    if (isLoading)
      return (
        <div className="flex items-center justify-center text-3xl font-bold h-screen">
          Loading...
        </div>
      );
  }

  return (
    <div className="relative flex-1 h-full py-5 px-0 flex flex-col">
      <SideBar />
      <Cards />
    </div>
  );
};

export default Content;
