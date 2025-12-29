import type { ContentType } from "../types/content.type";

const Tags = ({ content }: { content: ContentType }) => {
  const tagStyle =
    "bg-linear-to-r from-blue-600 to-blue-400 rounded-lg px-2 py-0.5 ";

  return (
    <>
      {content.tags.map((t) => (
        <div
          key={String(t._id)}
          className={`${tagStyle} hover:scale-105 transition-all duration-100 ease-in-out cursor-default`}
        >
          {t.tag}
        </div>
      ))}
    </>
  );
};

export default Tags;
