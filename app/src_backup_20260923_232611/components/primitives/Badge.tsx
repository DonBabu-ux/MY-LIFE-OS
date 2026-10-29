import React from "react";
import { View, type ViewProps } from "react-native";
import { useTheme } from "@design";
import { Text } from "./Text";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "accent";

export type BadgeProps = ViewProps & {
  label: string;
  tone?: BadgeTone;
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  tone = "neutral",
  style,
  ...rest
}) => {
  const theme = useTheme();
  const toneColor = {
    neutral: theme.colors.textMuted,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger:  theme.colors.danger,
    accent:  theme.colors.accent,
  }[tone];

  return (
    <View
      {...rest}
      style={[
        {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: 2,
          borderRadius: theme.radii.sm,
          backgroundColor: theme.colors.surfaceAlt,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Text variant="captionStrong" style={{ color: toneColor }}>
        {label}
      </Text>
    </View>
  );
};
