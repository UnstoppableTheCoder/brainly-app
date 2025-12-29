import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthProvider from "../contexts/auth/AuthProvider";

const Layout = () => {
  return (
    <AuthProvider>
      <div className="text-black dark:bg-gray-800 min-h-screen flex flex-col">
        <Navbar needsLogIn={true} />
        <div className="px-3 flex flex-col flex-1 h-full shadow-lg">
          <Outlet />
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Layout;
