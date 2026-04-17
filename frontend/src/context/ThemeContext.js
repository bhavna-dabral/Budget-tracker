import { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProviderCustom = ({ children }) => {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => setDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);