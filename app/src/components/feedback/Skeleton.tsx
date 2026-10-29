import React from "react";
import { View, type ViewStyle } from "react-native";
import { useTheme } from "@design";

export type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 16,
  radius,
  style,
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius ?? theme.radii.sm,
          backgroundColor: theme.colors.surfaceAlt,
        },
        style,
      ]}
    />
  );
};
