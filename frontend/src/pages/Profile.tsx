import { Navigate } from "react-router";
import ProfileModal from "../components/modals/profile/ProfileModal";
import useAuthContext from "../contexts/auth/useAuthContext";
import useProfile from "../hooks/useProfile";

const Profile = () => {
  const { isLoggedIn, isLoading, logout } = useAuthContext();
  const { user, isLoading: isProfileLoading, error } = useProfile();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center text-3xl font-bold h-screen">
        Loading...
      </div>
    );

  const handleChangePassword = () => {
    const element = document.getElementById(
      "profile_change_password"
    ) as HTMLDialogElement | null;
    element?.showModal();
  };

  if (isProfileLoading)
    return <div className="m-auto text-5xl font-bold">Loading...</div>;

  if (!user) {
    return <div>No user found.</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex items-center justify-center flex-col space-y-10 max-w-6xl mx-auto shadow-lg shadow-gray-300 dark:shadow-md dark:shadow-blue-400 flex-1 w-full rounded-lg p-5">
      <div className="flex flex-col items-center gap-y-20">
        <h1 className="text-5xl font-bold bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Your Profile
        </h1>

        <div className="relative">
          <div className="absolute -top-15 right-0 cursor-pointer bg-linear-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-lg hover:scale-105 transition-all duration-100">
            Edit
          </div>
          <div className="flex flex-col gap-5 pt-5 inset-shadow-sm inset-shadow-blue-100 dark:inset-shadow-blue-400 shadow-md shadow-blue-100 dark:shadow-blue-400 p-5 rounded-lg">
            <div className="hover:scale-102 transition-all duration-100 flex text-blue-500 text-xl md:text-3xl font-semibold inset-shadow-sm inset-shadow-blue-200 dark:inset-shadow-blue-400 shadow-md shadow-blue-200 dark:shadow-blue-400 px-3 py-2 rounded-lg">
              <p className="w-40 ">Name: </p>
              <p>{user.name}</p>
            </div>
            <div className="hover:scale-102 transition-all duration-100 flex text-xl md:text-3xl text-blue-500 font-semibold inset-shadow-sm inset-shadow-blue-200 dark:inset-shadow-blue-400  shadow-md shadow-blue-200 dark:shadow-blue-400 px-3 py-2 rounded-lg">
              <p className="w-40">Email: </p>
              <p>{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between w-full">
          <button
            onClick={handleChangePassword}
            className="text-white font-bold text-xl px-4 py-2 bg-blue-500 rounded-lg  hover:bg-blue-600 cursor-pointer active:bg-blue-700 duration-100"
          >
            Change Password
          </button>
          <button
            onClick={() => logout()}
            className="text-white font-bold text-xl px-4 py-2 bg-red-500 rounded-lg  hover:bg-red-600 cursor-pointer active:bg-red-700 duration-100"
          >
            Logout
          </button>
        </div>

        <ProfileModal modalId="profile_change_password" />
      </div>
    </div>
  );
};

export default Profile;
