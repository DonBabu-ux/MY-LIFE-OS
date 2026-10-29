import { Platform, ViewStyle } from "react-native";

export type Elevation = Pick<
  ViewStyle,
  "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "elevation"
>;

export const shadows = {
  e0: {} as Elevation,
  e1: Platform.select<Elevation>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2
    },
    android: { elevation: 1 },
    default: {}
  })!,
  e2: Platform.select<Elevation>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 4
    },
    android: { elevation: 3 },
    default: {}
  })!,
  e3: Platform.select<Elevation>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.09,
      shadowRadius: 8
    },
    android: { elevation: 6 },
    default: {}
  })!,
  e4: Platform.select<Elevation>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16
    },
    android: { elevation: 12 },
    default: {}
  })!
} as const;

export type Shadows = typeof shadows;
