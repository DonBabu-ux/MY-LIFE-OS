import React from "react";
import { ActivityIndicator, View, type ViewStyle } from "react-native";
import { useTheme } from "@design";

export type SpinnerProps = {
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
  centered?: boolean;
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "small",
  color,
  style,
  centered = false,
}) => {
  const theme = useTheme();
  const indicator = <ActivityIndicator size={size} color={color ?? theme.colors.accent} />;
  if (centered) {
    return (
      <View style={[{ flex: 1, alignItems: "center", justifyContent: "center" }, style]}>
        {indicator}
      </View>
    );
  }
  return <View style={style}>{indicator}</View>;
};
