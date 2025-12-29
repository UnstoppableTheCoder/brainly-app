import { useContext } from "react";
import ContentContext from "./ContentsContext";

const useContents = () => useContext(ContentContext);

export default useContents;
