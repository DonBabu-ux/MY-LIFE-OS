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
export type ButtonSize = "sm" | "md" | "lg" | "small" | "medium" | "large";

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  label?: string;
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  style?: ViewStyle;
};

export const Button: React.FC<ButtonProps> = ({
  label,
  title,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  icon,
  disabled,
  style,
  ...rest
}) => {
  const theme = useTheme();

  const buttonText = label ?? title ?? "";
  const effectiveIcon = leftIcon ?? icon;

  const normalizedSize = size === "small" ? "sm" : size === "large" ? "lg" : size === "medium" ? "md" : size;
  const heights: Record<"sm" | "md" | "lg", number> = { sm: 36, md: 44, lg: 52 };
  const paddings: Record<"sm" | "md" | "lg", number> = { sm: 12, md: 16, lg: 20 };
  const textVariant = normalizedSize === "sm" ? "captionStrong" : "bodyStrong";

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
          height: heights[normalizedSize],
          paddingHorizontal: paddings[normalizedSize],
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
          {effectiveIcon}
          {buttonText ? (
            <Text variant={textVariant} style={{ color: fg }}>
              {buttonText}
            </Text>
          ) : null}
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
};
