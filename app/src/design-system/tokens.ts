export const palette = {
  neutral0:   "#FFFFFF",
  neutral50:  "#F7F7F5",
  neutral100: "#EFEFEC",
  neutral200: "#E4E4E1",
  neutral300: "#D2D3CE",
  neutral400: "#A8ACB4",
  neutral500: "#7A8089",
  neutral600: "#5B6470",
  neutral700: "#3D444E",
  neutral800: "#22262E",
  neutral900: "#14161A",
  neutral950: "#0E1013",
  accent400: "#7BA0FF",
  accent500: "#5B8BFF",
  accent600: "#2F6BFF",
  accent700: "#1F55DB",
  success400: "#3FBF8C",
  success500: "#1E9E6A",
  success600: "#167A52",
  warning400: "#E5A63D",
  warning500: "#D08700",
  warning600: "#A56B00",
  danger400: "#E87970",
  danger500: "#D9453B",
  danger600: "#B3342C",
  info400: "#5B8BFF",
  info500: "#2F6BFF",
  info600: "#1F55DB",
  income: "#1E9E6A",
  expense: "#D9453B"
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  mega: 48,
  giga: 64
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999
} as const;

export const fontSize = {
  caption: 13,
  body: 15,
  h3: 17,
  h2: 20,
  h1: 24,
  display: 32,
  mono: 14
} as const;

export const lineHeight = {
  caption: 18,
  body: 22,
  h3: 24,
  h2: 28,
  h1: 32,
  display: 40,
  mono: 20
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700"
} as const;

export const duration = {
  fast: 150,
  base: 220,
  slow: 320,
  slower: 480
} as const;

export const easing = {
  standard: "ease-out",
  enter: "ease-out",
  exit: "ease-in"
} as const;
