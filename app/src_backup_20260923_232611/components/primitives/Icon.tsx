import React from "react";
import { View, type ViewStyle } from "react-native";
import { useTheme } from "@design";
import { Text } from "./Text";

/**
 * Placeholder icon. Once react-native-vector-icons is wired into Android,
 * this will render <MaterialCommunityIcons name={name} .../>.
 */
export type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, color, style }) => {
  const theme = useTheme();
  return (
    <View style={[{ width: size, height: size, alignItems: "center", justifyContent: "center" }, style]}>
      <Text style={{ fontSize: size, color: color ?? theme.colors.text }}>{name.charAt(0)}</Text>
    </View>
  );
};
