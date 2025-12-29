import { type Dispatch, type SetStateAction } from "react";
import type { Passwords } from "../../../types/profile/passwords.type";
import axios from "axios";
import { BACKEND_URL } from "../../../constants/constants";
import toast from "react-hot-toast";

export default function ProfileModalBtns({
  passwords,
  setPasswords,
}: {
  passwords: Passwords;
  setPasswords: Dispatch<SetStateAction<Passwords>>;
}) {
  const handleSavePassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) {
      toast.error("All the fields are required");
      setPasswords({
        oldPassword: "",
        newPassword: "",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/users/change-password`,
        passwords,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error changing the password: ", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
        return;
      }

      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setPasswords({
        oldPassword: "",
        newPassword: "",
      });
    }
  };

  return (
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button
          onClick={handleSavePassword}
          className={`btn mr-5 bg-linear-to-r from-blue-500 to-cyan-500 px-5 py-2 rounded-md text-white cursor-pointer  transition-colors duration-100`}
        >
          Change Password
        </button>
        <button className="btn bg-cyan-500 px-5 py-2 rounded-md text-white cursor-pointer transition-colors duration-100">
          Close
        </button>
      </form>
    </div>
  );
}
