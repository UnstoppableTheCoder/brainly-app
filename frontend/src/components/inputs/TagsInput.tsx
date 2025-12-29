import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type KeyboardEvent,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type { ContentPayloadTypes } from "../../types/modals/content.type";

export default function TagsInput({
  contentPayload,
  setContentPayload,
}: {
  contentPayload: ContentPayloadTypes;
  setContentPayload: Dispatch<SetStateAction<ContentPayloadTypes>>;
}) {
  const [tag, setTag] = useState("");
  const [editedTag, setEditedTag] = useState("");
  const [editingTagId, setEditingTagId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.querySelector("body")?.addEventListener("click", () => {
      setEditingTagId("");
    });
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== ",") {
      setTag(e.target.value);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      setContentPayload((prev) => ({
        ...prev,
        tags: [...prev.tags, { _id: uuidv4(), tag }],
      }));
      setTag("");
    } else if (e.key === "Backspace" && !tag) {
      // Later
    }
  };

  const handleTagDelete = (id: string) => {
    setContentPayload((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t._id !== id),
    }));
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedTag(e.target.value);
  };

  const handleTagKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      setContentPayload((prev) => {
        prev.tags[index].tag = editedTag;
        return prev;
      });
      setEditedTag("");
      inputRef.current!.focus();
      setEditingTagId("");
    } else if (e.key === "Backspace") {
      // do something here
    }
  };

  const handleTagInputClick = (
    e: MouseEvent<HTMLInputElement>,
    id: string,
    tag: string
  ) => {
    e.stopPropagation();
    setEditingTagId(id);
    setEditedTag(tag);
  };

  return (
    <div className="flex flex-wrap gap-2 border rounded-lg border-gray-300 p-3 shadow hover:shadow-md">
      {/* Tags */}
      {contentPayload.tags.map((t, index) => (
        <div
          key={String(t._id)}
          className={`bg-linear-to-r from-blue-500 to-cyan-500 rounded-md px-2 py-1 text-white flex gap-2 ${
            editingTagId === t._id
              ? "border-2 border-blue-600!"
              : "border-2 border-blue-300"
          }`}
        >
          <input
            type="text"
            value={editingTagId === t._id ? editedTag : t.tag}
            onChange={handleTagChange}
            onKeyDown={(e) => handleTagKeyDown(e, index)}
            onClick={(e) => handleTagInputClick(e, String(t._id), t.tag)}
            className={`field-sizing-content outline-none`}
          />

          <span
            onClick={() => handleTagDelete(String(t._id))}
            className="cursor-pointer hover:scale-105 duration-100 ease-in-out"
          >
            X
          </span>
        </div>
      ))}

      <input
        ref={inputRef}
        type="text"
        value={tag}
        placeholder="Enter to add a tag"
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="flex-1 outline-none"
      />
    </div>
  );
}
