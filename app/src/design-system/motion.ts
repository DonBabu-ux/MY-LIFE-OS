import { Easing } from "react-native";
import { duration } from "./tokens";

export const timing = {
  fast: { duration: duration.fast, easing: Easing.out(Easing.quad) },
  base: { duration: duration.base, easing: Easing.out(Easing.cubic) },
  slow: { duration: duration.slow, easing: Easing.out(Easing.cubic) },
  slower: { duration: duration.slower, easing: Easing.out(Easing.cubic) }
} as const;

export const springs = {
  base: { damping: 22, stiffness: 180, mass: 1 },
  soft: { damping: 26, stiffness: 140, mass: 1 },
  snap: { damping: 18, stiffness: 260, mass: 1 }
} as const;

export const reducedMotion = {
  duration: 100,
  easing: Easing.linear
} as const;
