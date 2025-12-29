import { useState, type ChangeEvent } from "react";
import TypesInput from "../../inputs/TypesInput";
import TextInput from "../../inputs/TextInput";
import TagsInput from "../../inputs/TagsInput";
import type { ContentPayloadTypes } from "../../../types/modals/content.type";
import type { ContentType } from "../../../types/content.type";
import ContentModalBtns from "./ContentModalBtns";

const ContentModal = ({
  type,
  modalId,
  content,
}: {
  type: string;
  modalId: string;
  content?: ContentType;
}) => {
  const [contentPayload, setContentPayload] = useState<ContentPayloadTypes>({
    title: content?.title || "",
    link: content?.link || "",
    linkType: content?.linkType || "",
    tags: content?.tags || [],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContentPayload((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <dialog
        id={modalId}
        className="modal absolute m-auto modal-box p-5 rounded-lg w-xl shadow-md shadow-blue-300 dark:bg-gray-800 dark:shadow-blue-400 dark:text-white"
      >
        <div className="space-y-5">
          <h3 className="text-center text-3xl font-bold bg-linear-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            Add Your Note
          </h3>
          <div className="flex flex-col gap-y-3">
            <TextInput
              value={contentPayload.title}
              name="title"
              onChange={handleChange}
              placeholder="Enter your title"
            />
            <TextInput
              value={contentPayload.link}
              name="link"
              onChange={handleChange}
              placeholder="Enter your link"
            />
            <TypesInput
              name="linkType"
              linkType={contentPayload.linkType}
              onChange={handleChange}
            />
            <TagsInput
              contentPayload={contentPayload}
              setContentPayload={setContentPayload}
            />
            <div className="flex gap-5">
              <ContentModalBtns
                type={type}
                content={content!}
                contentPayload={contentPayload}
                setContentPayload={setContentPayload}
              />
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ContentModal;
