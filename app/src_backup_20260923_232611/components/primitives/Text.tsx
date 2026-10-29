import React from "react";
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from "react-native";
import { useTheme } from "@design";
import type { TypeStyle } from "@design";

export type TextVariant =
  | "display" | "h1" | "h2" | "h3" | "body" | "bodyStrong"
  | "caption" | "captionStrong" | "mono";

export type TextColor =
  | "text" | "textMuted" | "textSubtle" | "textInverse"
  | "accent" | "success" | "warning" | "danger" | "info"
  | "income" | "expense";

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextStyle["textAlign"];
};

export const Text: React.FC<TextProps> = ({
  variant = "body",
  color = "text",
  align,
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();
  const typeStyle: TypeStyle = theme.typography[variant];
  const textColor = theme.colors[color];
  return (
    <RNText
      {...rest}
      style={[typeStyle, { color: textColor, textAlign: align }, style]}
    >
      {children}
    </RNText>
  );
};
