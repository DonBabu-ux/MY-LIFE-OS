import React, { useState } from "react";
import {
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@design";
import { Text } from "./Text";

export type InputProps = Omit<TextInputProps, "style"> & {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.accent
      : theme.colors.border;

  return (
    <View style={containerStyle}>
      {label && (
        <Text variant="captionStrong" color="textMuted" style={{ marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <TextInput
        {...rest}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        placeholderTextColor={theme.colors.textSubtle}
        style={{
          height: 44,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor,
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          fontSize: theme.typography.body.fontSize,
        }}
      />
      {error ? (
        <Text variant="caption" color="danger" style={{ marginTop: 4 }}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="textSubtle" style={{ marginTop: 4 }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
};
