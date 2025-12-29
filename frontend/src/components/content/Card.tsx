import { Copy, Pencil, Trash } from "lucide-react";
import type { ContentType } from "../../types/content.type";
import Modal from "../modals/content/ContentModal";
import type { Types } from "mongoose";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../constants/constants";
import useContents from "../../contexts/content/useContents";
import { useState } from "react";
import Icon from "../Icons/CardIcon";
import Embed from "../embed/Embed";
import Tags from "../Tags";

const Card = ({ content }: { content: ContentType }) => {
  const { setContents } = useContents();
  const [isCopying, setIsCopying] = useState(false);
  const iconStyle =
    "cursor-pointer hover:scale-110 transition-all duration-100 ease-in-out rounded-full p-1";

  const editNote = () => {
    const element = document.getElementById(
      `content_edit_modal_${content._id}`
    ) as HTMLDialogElement | null;
    element?.showModal();
  };

  const deleteNote = async (id: Types.ObjectId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/contents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error deleting the note");
      }

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setContents((prev) =>
          prev.filter((content) => content._id !== result.data.content._id)
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  const handleCopyLink = (linkType: string, link: string) => {
    setIsCopying(true);
    const formattedLink = getFormattedLink(linkType, link);
    navigator.clipboard.writeText(formattedLink);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const getFormattedLink = (linkType: string, link: string) => {
    switch (linkType) {
      case "youtube":
        return link.replace("/embed/", "/watch?v=");
      case "twitter":
        return link.replace("twitter.com", "x.com");
      default:
        return link;
    }
  };

  return (
    <div className="bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-300 dark:shadow dark:shadow-blue-400 p-3">
      <div className="flex flex-col h-full gap-y-3">
        {/* Card heading */}
        <div className="flex items-center gap-3">
          <a
            href={getFormattedLink(content.linkType, content.link)}
            target="_blank"
          >
            <div className={iconStyle}>
              <Icon linkType={content.linkType} />
            </div>
          </a>
          <div className="flex-20 text-center text-lg font-semibold">
            {content.title}
          </div>
          <div className="relative">
            {isCopying && (
              <span className="absolute -top-8 -left-5 bg-linear-to-r from-blue-500 to-blue-700 px-3 rounded-xl py-1">
                Copied
              </span>
            )}
            <div
              onClick={() => handleCopyLink(content.linkType, content.link)}
              className={`${iconStyle}`}
            >
              <Copy />
            </div>
          </div>
          <div className={iconStyle} onClick={editNote}>
            <Pencil />
          </div>
          <div
            onClick={() => {
              if (content._id) deleteNote(content._id);
            }}
            className={iconStyle}
          >
            <Trash />
          </div>
        </div>

        {/* Card Content */}
        <div className="flex-1 flex flex-col gap-y-5">
          <Embed linkType={content.linkType} link={content.link} />

          {/* Tags */}
          <div className="flex gap-x-3 font-semibold">
            <Tags content={content} />
          </div>
        </div>

        <p className="text-blue-100">
          Added on{" "}
          {content.createdAt &&
            new Date(content.createdAt).toLocaleDateString()}
        </p>

        <Modal
          type="edit"
          modalId={`content_edit_modal_${content._id}`}
          content={content}
        />
      </div>
    </div>
  );
};

export default Card;
