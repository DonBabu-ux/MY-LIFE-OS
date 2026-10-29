import { palette } from "./tokens";

export type SemanticColors = {
  bg: string;
  bgElevated: string;
  surface: string;
  surfaceAlt: string;
  surfaceElevated: string;
  surfaceMuted: string;
  surfaceVariant: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  textInverse: string;
  accent: string;
  accentPressed: string;
  accentSubtle: string;
  onAccent: string;
  success: string;
  warning: string;
  danger: string;
  dangerSubtle: string;
  error: string;
  info: string;
  income: string;
  expense: string;
  overlay: string;
};

export const lightColors: SemanticColors = {
  bg: palette.neutral50,
  bgElevated: palette.neutral0,
  surface: palette.neutral0,
  surfaceAlt: palette.neutral100,
  surfaceElevated: palette.neutral0,
  surfaceMuted: palette.neutral100,
  surfaceVariant: palette.neutral100,
  border: palette.neutral200,
  borderStrong: palette.neutral300,
  text: palette.neutral900,
  textMuted: palette.neutral600,
  textSubtle: palette.neutral500,
  textInverse: palette.neutral0,
  accent: palette.accent600,
  accentPressed: palette.accent700,
  accentSubtle: "#E4EBFF",
  onAccent: palette.neutral0,
  success: palette.success500,
  warning: palette.warning500,
  danger: palette.danger500,
  dangerSubtle: "#FDE8E7",
  error: palette.danger500,
  info: palette.info500,
  income: palette.income,
  expense: palette.expense,
  overlay: "rgba(20, 22, 26, 0.5)"
};

export const darkColors: SemanticColors = {
  bg: palette.neutral950,
  bgElevated: palette.neutral900,
  surface: "#16191E",
  surfaceAlt: "#1D2127",
  surfaceElevated: "#1D2127",
  surfaceMuted: "#16191E",
  surfaceVariant: "#1D2127",
  border: "#262B33",
  borderStrong: "#343B45",
  text: "#F2F3F5",
  textMuted: "#9AA3AF",
  textSubtle: "#6B7480",
  textInverse: palette.neutral900,
  accent: palette.accent500,
  accentPressed: palette.accent400,
  accentSubtle: "#1A2540",
  onAccent: palette.neutral0,
  success: palette.success400,
  warning: palette.warning400,
  danger: palette.danger400,
  dangerSubtle: "#3B1E21",
  error: palette.danger400,
  info: palette.info400,
  income: "#3FBF8C",
  expense: "#E87970",
  overlay: "rgba(0, 0, 0, 0.6)"
};
