import { NavLink } from "react-router";
import useAuthContext from "../contexts/auth/useAuthContext";
import { CirclePlus, LogOut, Moon, Share2, Sun, User } from "lucide-react";
import { NavbarIcon } from "./Icons/NavbarIcon";
import { useTheme } from "../contexts/theme/useTheme";

const Navbar = ({ needsLogIn }: { needsLogIn: boolean }) => {
  const { logout, isLoggedIn } = useAuthContext();
  const { theme, setTheme } = useTheme();

  const btnsStyle =
    "flex gap-3 px-3 h-min px-3 py-2 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-gray-800 hover:text cursor-pointer transition-all duration-100";

  const handleAddContent = () => {
    const element = document.getElementById(
      "content_add_modal"
    ) as HTMLDialogElement | null;
    element?.showModal();
  };

  const handleThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    localStorage.theme = theme === "light" ? "dark" : "light";
  };

  const handleShare = () => {
    const element = document.getElementById(
      "share_link_modal"
    ) as HTMLDialogElement | null;
    element?.showModal();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="fixed inset-x-0 bg-white dark:bg-gray-800 z-1 flex justify-between py-4 items-center px-8 border-b border-gray-200 dark:border-none shadow-sm shadow-blue-200 dark:shadow-blue-400">
        <div>
          <NavLink to={"/"}>
            <NavbarIcon tooltip="Home Page">
              <div className="text-4xl font-bold bg-linear-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text cursor-pointer">
                Brainly
              </div>
            </NavbarIcon>
          </NavLink>
        </div>
        <div className="flex items-center gap-4 text-gray-800 hover:hover:text cursor-pointer">
          {needsLogIn && isLoggedIn && (
            <>
              <NavbarIcon tooltip="Share">
                <div onClick={handleShare} className={btnsStyle}>
                  <Share2 />
                </div>
              </NavbarIcon>
              <NavbarIcon tooltip="Add Content">
                <div className={btnsStyle} onClick={handleAddContent}>
                  <CirclePlus />
                </div>
              </NavbarIcon>
            </>
          )}
          <NavbarIcon tooltip="Change Theme">
            <div onClick={handleThemeChange} className={btnsStyle}>
              {theme === "light" ? <Moon /> : <Sun />}
            </div>
          </NavbarIcon>
          {needsLogIn && isLoggedIn && (
            <>
              <NavLink to={"/profile"}>
                <NavbarIcon tooltip="User Profile">
                  <div className={`${btnsStyle}`}>
                    <User />
                  </div>
                </NavbarIcon>
              </NavLink>

              <NavbarIcon tooltip="Logout">
                <div className={btnsStyle} onClick={handleLogout}>
                  <LogOut />
                </div>
              </NavbarIcon>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
