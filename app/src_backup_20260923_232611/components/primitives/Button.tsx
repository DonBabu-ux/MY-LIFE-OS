import React from "react";
import {
  Pressable,
  ActivityIndicator,
  View,
  type PressableProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@design";
import { Text } from "./Text";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...rest
}) => {
  const theme = useTheme();

  const heights: Record<ButtonSize, number> = { sm: 36, md: 44, lg: 52 };
  const paddings: Record<ButtonSize, number> = { sm: 12, md: 16, lg: 20 };
  const textVariant = size === "sm" ? "captionStrong" : "bodyStrong";

  const bg =
    variant === "primary" ? theme.colors.accent :
    variant === "danger"  ? theme.colors.danger :
    variant === "secondary" ? theme.colors.surface :
    "transparent";

  const borderColor =
    variant === "secondary" ? theme.colors.border : "transparent";

  const fg =
    variant === "primary" || variant === "danger"
      ? theme.colors.onAccent
      : variant === "ghost"
        ? theme.colors.accent
        : theme.colors.text;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          height: heights[size],
          paddingHorizontal: paddings[size],
          backgroundColor: bg,
          borderColor,
          borderWidth: variant === "secondary" ? 1 : 0,
          borderRadius: theme.radii.md,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          width: fullWidth ? "100%" : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {leftIcon}
          <Text variant={textVariant} style={{ color: fg }}>
            {label}
          </Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
};
