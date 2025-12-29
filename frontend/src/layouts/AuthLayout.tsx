import { Outlet } from "react-router";
import AuthProvider from "../contexts/auth/AuthProvider";

const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default AuthLayout;
