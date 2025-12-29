import { useEffect, useState, type ReactNode } from "react";
import type { Theme } from "../../types/contexts/theme/theme.type";
import { ThemeContext } from "./ThemeContext";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const handleSetTheme = () => {
      const theme = localStorage.getItem("theme") || "light";
      setTheme(theme as unknown as Theme);
    };

    handleSetTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
