import { useState, type ChangeEvent } from "react";
import PasswordInput from "../../inputs/PasswordInput";
import ProfileModalBtns from "./ProfileModalBtns";

const ProfileModal = ({ modalId }: { modalId: string }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <dialog
        id={modalId}
        className="modal absolute m-auto modal-box p-5 rounded-lg w-xl shadow-md shadow-blue-300 dark:bg-gray-800 dark:shadow-blue-400"
      >
        <div className="space-y-5">
          <h3 className="text-center text-3xl font-bold bg-linear-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            Change Your Password
          </h3>
          <div className="flex flex-col gap-y-3">
            <PasswordInput
              value={passwords.oldPassword}
              name="oldPassword"
              onChange={handleChange}
              placeholder="Enter the old password"
            />
            <PasswordInput
              value={passwords.newPassword}
              name="newPassword"
              onChange={handleChange}
              placeholder="Enter the new password"
            />
            <div className="flex gap-5">
              <ProfileModalBtns
                passwords={passwords}
                setPasswords={setPasswords}
              />
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProfileModal;
