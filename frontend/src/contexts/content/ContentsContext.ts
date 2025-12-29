import { createContext } from "react";
import type { ContentContextType } from "../../types/content.type";

const ContentsContext = createContext<ContentContextType>({
  contents: [],
  setContents: () => {},
  filteredContents: [],
  filter: "all",
  setFilter: () => {},
});

export default ContentsContext;
