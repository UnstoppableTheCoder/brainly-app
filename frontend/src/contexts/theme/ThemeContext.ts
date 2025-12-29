import { createContext } from "react";
import type { ThemeContextType } from "../../types/contexts/theme/theme.type";

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});
