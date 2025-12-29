import axios from "axios";
import { CheckLine, Copy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../constants/constants";
import toast from "react-hot-toast";
import useAuthContext from "../../../contexts/auth/useAuthContext";

const ShareModal = ({ modalId }: { modalId: string }) => {
  const [link, setLink] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/links`, {
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          setLink(result.data.url);
        }
      } catch (error) {
        console.log("Error fetching the link: ", error);
        toast.error(error instanceof Error ? error.message : String(error));
      }
    };

    if (isLoggedIn) {
      fetchLink();
    }
  }, [isLoggedIn]);

  const handleCreateShareLink = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/links`,
        { share: true },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setLink(response.data.data.url);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error creating the link: ", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
        return;
      }

      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  const handleCopyLink = () => {
    setIsCopying(true);
    navigator.clipboard.writeText(link);

    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleShareLinkDelete = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/links`,
        { share: false },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setLink("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error creating the link: ", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
        return;
      }

      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div>
      <dialog
        id={modalId}
        className="modal absolute m-auto modal-box px-8 pt-5 pb-10 rounded-lg w-xl shadow-md shadow-blue-300 dark:bg-gray-800 dark:shadow-blue-400"
      >
        <div className="space-y-10 ">
          <h3 className="text-center mt-5 text-3xl font-bold bg-linear-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            Share Your Second Brain
          </h3>

          <div className="modal-action absolute top-3 right-3">
            <form method="dialog">
              <button className="btn rounded-md text-blue-500 hover:font-bold dark:text-white hover:scale-105 text-2xl cursor-pointer transition-colors duration-200 ease-in-out border-none">
                <X />
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-y-3">
            {link === "" ? (
              <button
                onClick={handleCreateShareLink}
                className="bg-linear-to-r from-blue-500 to-cyan-500 text-lg rounded-lg py-2 text-white text-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-200 ease-in cursor-pointer"
              >
                Create Share Link
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-2xl dark:text-white font-bold text-blue-500">
                  Your Link:
                </p>
                <div className="flex justify-between text-white gap-3">
                  <p className="flex-1 overflow-hidden flex justify-between bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg px-3 py-2 text-white text-semibold">
                    <span className="w-[90%] overflow-hidden">{link}</span>
                    <span
                      onClick={handleCopyLink}
                      className="flex cursor-pointer hover:scale-105 duration-200 ease-in-out"
                    >
                      {isCopying ? <CheckLine /> : <Copy />}
                    </span>
                  </p>

                  <div className="modal-action">
                    <form method="dialog">
                      <button
                        onClick={handleShareLinkDelete}
                        className="px-3 py-2 bg-red-500 rounded-lg cursor-pointer"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ShareModal;
