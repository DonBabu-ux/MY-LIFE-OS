import React, { createContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { themes, type Theme, type ColorScheme } from "./theme";

type ThemeOverride = ColorScheme | "system";

export const ThemeContext = createContext<Theme>(themes.light);

type ThemeProviderProps = {
  children: React.ReactNode;
  override?: ThemeOverride;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, override }) => {
  const system = useColorScheme();

  const theme = useMemo<Theme>(() => {
    if (override && override !== "system") return themes[override];
    return system === "dark" ? themes.dark : themes.light;
  }, [override, system]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
