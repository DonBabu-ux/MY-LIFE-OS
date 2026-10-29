import { fontSize, lineHeight, fontWeight } from "./tokens";

export type TypeStyle = {
  fontSize: number;
  lineHeight: number;
  fontWeight: "400" | "500" | "600" | "700";
  letterSpacing?: number;
};

export const typography = {
  display: {
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5
  } as TypeStyle,
  h1: {
    fontSize: fontSize.h1,
    lineHeight: lineHeight.h1,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.3
  } as TypeStyle,
  h2: {
    fontSize: fontSize.h2,
    lineHeight: lineHeight.h2,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.2
  } as TypeStyle,
  h3: {
    fontSize: fontSize.h3,
    lineHeight: lineHeight.h3,
    fontWeight: fontWeight.semibold
  } as TypeStyle,
  body: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontWeight: fontWeight.regular
  } as TypeStyle,
  bodyStrong: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontWeight: fontWeight.semibold
  } as TypeStyle,
  caption: {
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
    fontWeight: fontWeight.regular
  } as TypeStyle,
  captionStrong: {
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
    fontWeight: fontWeight.semibold
  } as TypeStyle,
  mono: {
    fontSize: fontSize.mono,
    lineHeight: lineHeight.mono,
    fontWeight: fontWeight.regular
  } as TypeStyle
} as const;

export type Typography = typeof typography;
