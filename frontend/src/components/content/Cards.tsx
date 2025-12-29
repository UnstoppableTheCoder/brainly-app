import { useEffect } from "react";
import useContents from "../../contexts/content/useContents";
import Card from "./Card";
import useAuthContext from "../../contexts/auth/useAuthContext";

const Cards = () => {
  const { filteredContents, setFilter, filter } = useContents();
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    setFilter("all");
  }, []);

  const handleAddContent = () => {
    const element = document.getElementById(
      "content_add_modal"
    ) as HTMLDialogElement | null;
    element?.showModal();
  };

  const btnsStyle =
    "flex gap-3 px-10 py-3 text-2xl bg-linear-to-r from-cyan-500 hover:from-blue-500 to-blue-500 hover:to-cyan-500 text-white rounded-lg text-gray-800 hover:text cursor-pointer transition-all duration-300";

  return (
    <>
      {filteredContents.length ? (
        <div className="text-white mt-20 h-min w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* Card */}
          {filteredContents.map((content) => (
            <Card key={String(content._id)} content={content} />
          ))}
        </div>
      ) : (
        <div className="text-white flex-1 mt-20 w-full flex items-center justify-center flex-col gap-y-8">
          <h1 className="text-5xl font-bold text-center bg-linear-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            {filter === "all"
              ? "No Content Found"
              : `No ${filter.toLocaleUpperCase()} Content Found`}
          </h1>
          {isLoggedIn && (
            <button onClick={handleAddContent} className={btnsStyle}>
              Create Content
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Cards;
