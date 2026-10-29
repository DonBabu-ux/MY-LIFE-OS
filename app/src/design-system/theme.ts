import { lightColors, darkColors, type SemanticColors } from "./colors";
import { typography, type Typography } from "./typography";
import { spacing } from "./spacing";
import { radii } from "./radii";
import { shadows, type Shadows } from "./shadows";
import { timing, springs } from "./motion";

export type ColorScheme = "light" | "dark";

export type Theme = {
  scheme: ColorScheme;
  colors: SemanticColors;
  typography: Typography;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: Shadows;
  motion: { timing: typeof timing; springs: typeof springs };
};

export const lightTheme: Theme = {
  scheme: "light",
  colors: lightColors,
  typography,
  spacing,
  radii,
  shadows,
  motion: { timing, springs }
};

export const darkTheme: Theme = {
  scheme: "dark",
  colors: darkColors,
  typography,
  spacing,
  radii,
  shadows,
  motion: { timing, springs }
};

export const themes: Record<ColorScheme, Theme> = {
  light: lightTheme,
  dark: darkTheme
};
