import { Route, Routes } from "react-router";
import Layout from "./layouts/Layout";
import Content from "./pages/Content";
import { useEffect } from "react";
import { useTheme } from "./contexts/theme/useTheme";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import ContentsProvider from "./contexts/content/ContentsProvider";
import Navbar from "./components/Navbar";
import PagesLayout from "./layouts/PagesLayout";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Footer from "./components/Footer";

// No content message
// Verify user options
// Mention verify in profile
// Enable profile edit
// Enable multiple share link creation with proper label
// Add eye option to the password input
// When handling submit, disable all the inputs too
// Add search button at the top
// Make it responsive

const App = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark"
    );
  }, [theme]);

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="signup" element={<AuthPage />} />
          <Route path="login" element={<AuthPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:hash" element={<ResetPassword />} />

          <Route element={<PagesLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="contents" element={<Content needsLogIn={false} />} />
          </Route>
        </Route>
        <Route
          path="contents/:hash"
          element={
            <ContentsProvider needsLogIn={false}>
              <div className="dark:bg-gray-800 bg-light min-h-screen flex flex-col">
                <Navbar needsLogIn={false} />
                <Content needsLogIn={false} />
                <Footer />
              </div>
            </ContentsProvider>
          }
        />
      </Routes>

      <Toaster />
    </>
  );
};

export default App;
