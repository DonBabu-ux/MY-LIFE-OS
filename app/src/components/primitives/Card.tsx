import React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "@design";

export type CardProps = ViewProps & {
  padding?: "none" | "sm" | "md" | "lg";
  elevation?: "e0" | "e1" | "e2" | "e3" | "e4";
  bordered?: boolean;
};

export const Card: React.FC<CardProps> = ({
  padding = "md",
  elevation = "e0",
  bordered = true,
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();

  const paddings: Record<NonNullable<CardProps["padding"]>, number> = {
    none: 0, sm: theme.spacing.sm, md: theme.spacing.lg, lg: theme.spacing.xxl,
  };

  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          borderWidth: bordered ? 1 : 0,
          borderColor: theme.colors.border,
          padding: paddings[padding],
        },
        theme.shadows[elevation] as ViewStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
};
