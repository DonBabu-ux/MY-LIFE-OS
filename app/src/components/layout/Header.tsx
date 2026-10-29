import React from "react";
import { View, Pressable, type ViewStyle } from "react-native";
import { useTheme } from "@design";
import { Text } from "@components/primitives";

export type HeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  style?: ViewStyle;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBack,
  left,
  right,
  rightAction,
  style,
}) => {
  const theme = useTheme();
  const effectiveShowBack = showBack || !!onBack;
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: theme.spacing.md,
          gap: theme.spacing.md,
        },
        style,
      ]}
    >
      {effectiveShowBack && (
        <Pressable onPress={onBack} hitSlop={12}>
          <Text variant="h3" color="accent">←</Text>
        </Pressable>
      )}
      {left}
      <View style={{ flex: 1 }}>
        <Text variant="h2" numberOfLines={1}>{title}</Text>
        {subtitle && (
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {right ?? (rightAction && (
        <Pressable onPress={rightAction.onPress} hitSlop={12}>
          <Text variant="bodyStrong" color="accent">{rightAction.icon}</Text>
        </Pressable>
      ))}
    </View>
  );
};
