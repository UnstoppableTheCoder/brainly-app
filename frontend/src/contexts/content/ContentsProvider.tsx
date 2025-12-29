import { useEffect, useState, type ReactNode } from "react";
import type { ContentsType, Filter } from "../../types/content.type";
import ContentsContext from "./ContentsContext";
import { BACKEND_URL } from "../../constants/constants";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import useAuthContext from "../auth/useAuthContext";

const ContentsProvider = ({
  children,
  needsLogIn,
}: {
  children: ReactNode;
  needsLogIn: boolean;
}) => {
  const [contents, setContents] = useState<ContentsType>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const { hash } = useParams();
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    const getContentsUsingCredentials = async () => {
      const response = await fetch(`${BACKEND_URL}/api/v1/contents`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setContents(result.data.contents);
      } else {
        toast.error("Error fetching the content");
      }
    };

    const getContentsUsingHash = async () => {
      const response = await fetch(`${BACKEND_URL}/api/v1/contents/${hash}`, {
        method: "GET",
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setContents(result.data.contents);
      } else {
        toast.error(result.message);
      }
    };

    if (needsLogIn && isLoggedIn) {
      getContentsUsingCredentials();
    } else if (!needsLogIn && hash) {
      getContentsUsingHash();
    }
  }, [isLoggedIn, needsLogIn, hash]);

  const getFilteredContent = (contents: ContentsType, filter: Filter) => {
    if (filter === "all") {
      return contents;
    } else {
      return contents.filter((content) => content.linkType === filter);
    }
  };

  const filteredContents = getFilteredContent(contents, filter);

  return (
    <ContentsContext.Provider
      value={{ contents, setContents, filteredContents, filter, setFilter }}
    >
      <>{children}</>
    </ContentsContext.Provider>
  );
};

export default ContentsProvider;
