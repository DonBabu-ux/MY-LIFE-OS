import React from "react";
import { View, Pressable, type ViewStyle } from "react-native";
import { useTheme } from "@design";
import { Text } from "@components/primitives";

export type HeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  left,
  right,
  style,
}) => {
  const theme = useTheme();
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
      {onBack && (
        <Pressable onPress={onBack} hitSlop={12}>
          <Text variant="h3" color="accent"></Text>
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
      {right}
    </View>
  );
};
