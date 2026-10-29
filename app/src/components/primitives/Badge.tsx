import React from "react";
import { View, type ViewProps } from "react-native";
import { useTheme } from "@design";
import { Text } from "./Text";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "accent" | "info" | string;

export type BadgeProps = ViewProps & {
  label: string;
  tone?: BadgeTone;
  variant?: BadgeTone;
  size?: "sm" | "md" | "lg" | string;
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  tone,
  variant,
  size = "md",
  style,
  ...rest
}) => {
  const theme = useTheme();
  const effectiveTone = tone ?? variant ?? "neutral";
  const toneMap: Record<string, string> = {
    neutral: theme.colors.textMuted,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger:  theme.colors.danger,
    accent:  theme.colors.accent,
    info:    theme.colors.info,
    primary: theme.colors.accent,
    secondary: theme.colors.textMuted,
  };
  const toneColor = toneMap[effectiveTone] || theme.colors.textMuted;

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
