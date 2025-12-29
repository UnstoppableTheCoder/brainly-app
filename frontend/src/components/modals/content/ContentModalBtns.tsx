import type { Dispatch, SetStateAction } from "react";
import type { ContentPayloadTypes } from "../../../types/modals/content.type";
import type { ContentType } from "../../../types/content.type";
import useContents from "../../../contexts/content/useContents";
import { useNavigate } from "react-router";
import axios from "axios";
import { BACKEND_URL } from "../../../constants/constants";
import toast from "react-hot-toast";

type PayloadType = Pick<ContentPayloadTypes, "title" | "link" | "linkType"> & {
  tags: string[];
};

export default function ContentModalBtns({
  type,
  content,
  contentPayload,
  setContentPayload,
}: {
  type: string;
  content: ContentType;
  contentPayload: ContentPayloadTypes;
  setContentPayload: Dispatch<SetStateAction<ContentPayloadTypes>>;
}) {
  const { setContents, setFilter } = useContents();
  const navigate = useNavigate();

  const handleSave = async () => {
    const { tags, ...payload } = contentPayload;

    const payloadTags = tags.map((t) => {
      if (typeof t !== "string") {
        return t.tag;
      } else {
        return t;
      }
    });

    const requestPayload: PayloadType = { ...payload, tags: payloadTags };

    switch (contentPayload.linkType) {
      case "youtube":
        // https://www.youtube.com/watch?v=al25hjznlrM
        requestPayload.link = contentPayload.link.replace(
          "/watch?v=",
          "/embed/"
        );
        break;

      case "twitter":
        // https://twitter.com/VibeMarketer_/status/2003207787501764896
        // https://twitter.com/cemburuya/status/1999602170971480359
        requestPayload.link = contentPayload.link.replace(
          "x.com",
          "twitter.com"
        );
        break;
    }

    if (type === "add") {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/v1/contents`,
          requestPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setContents((prev) => [response.data.data.content, ...prev]);
          setContentPayload({
            title: "",
            link: "",
            linkType: "",
            tags: [],
          });
          toast.success("Content created successfully");
          setFilter("all");
          navigate("/contents");
        } else {
          toast.error("Failed to create the content");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message);
          return;
        }

        toast.error(error instanceof Error ? error.message : String(error));
        return;
      }
    } else if (type === "edit") {
      try {
        const response = await axios.put(
          `${BACKEND_URL}/api/v1/contents/${content._id}`,
          requestPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          toast.success("Content updated successfully");
          setContents((prev) =>
            prev.map((c) =>
              c._id === content._id ? response.data.data.content : c
            )
          );
        } else {
          toast.error("Failed to update the content");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message);
          return;
        }

        toast.error(error instanceof Error ? error.message : String(error));
        return;
      }
    }
  };

  return (
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button
          onClick={handleSave}
          className="btn mr-5 bg-linear-to-r from-blue-500 to-cyan-500 px-5 py-2 rounded-md text-white cursor-pointer  transition-colors duration-100"
        >
          {type === "add" ? "Add" : "Save"}
        </button>
        <button className="btn btn bg-cyan-500 px-5 py-2 rounded-md text-white cursor-pointer transition-colors duration-100">
          Close
        </button>
      </form>
    </div>
  );
}
