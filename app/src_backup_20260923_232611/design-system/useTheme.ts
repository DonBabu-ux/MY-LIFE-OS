import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import type { Theme } from "./theme";

export const useTheme = (): Theme => useContext(ThemeContext);
