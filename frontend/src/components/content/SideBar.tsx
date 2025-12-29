import { ListCollapse } from "lucide-react";
import { useState } from "react";
import useContents from "../../contexts/content/useContents";
import type { Options } from "../../types/components/content/Sidebar.type";

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { filter, setFilter } = useContents();

  const options: Options = [
    { label: "All", value: "all" },
    { label: "Youtube", value: "youtube" },
    { label: "Twitter", value: "twitter" },
    { label: "Documents", value: "document" },
    { label: "Articles", value: "article" },
    { label: "Other", value: "other" },
  ];

  const sidebarOptionStyle =
    "bg-gray-200 w-full text-center py-3 rounded-lg text-xl hover:bg-gray-300 transition-colors duration-200 cursor-pointer text-white bg-linear-to-r from-cyan-500 to-blue-500 hover:to-cyan-500 hover:from-blue-500";

  const handleSidebarCollapse = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className={`fixed top-16 -left-5 ${
        isSidebarOpen ? "w-64 bottom-0 p-5 left-0" : "w-min"
      } z-10 bg-white dark:bg-gray-800 px-5  py-3 rounded-lg shadow-md shadow-gray-300 dark:shadow-blue-400 flex flex-col items-center justify-start gap-y-3 transition-all duration-100`}
    >
      <div
        onClick={handleSidebarCollapse}
        className="self-end cursor-pointer text-blue-600"
      >
        <ListCollapse className="size-7" />
      </div>
      <div
        className={`${
          isSidebarOpen
            ? "flex flex-col items-center justify-start gap-y-3"
            : "hidden"
        } w-full`}
      >
        <div className="text-3xl self-start font-bold bg-linear-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
          Your List
        </div>
        {options.map(({ label, value }, index) => (
          <div
            key={index}
            className={`${sidebarOptionStyle} ${
              filter === value &&
              "scale-105 font-bold text-xl transition duration-100 "
            }`}
            onClick={() => {
              setFilter(value);
              handleSidebarCollapse();
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
