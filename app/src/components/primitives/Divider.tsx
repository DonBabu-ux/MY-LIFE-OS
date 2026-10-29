import React from "react";
import { View, type ViewProps } from "react-native";
import { useTheme } from "@design";

export type DividerProps = ViewProps & {
  inset?: number;
};

export const Divider: React.FC<DividerProps> = ({ inset = 0, style, ...rest }) => {
  const theme = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          height: 1,
          backgroundColor: theme.colors.border,
          marginLeft: inset,
          marginRight: inset,
        },
        style,
      ]}
    />
  );
};
