import React from "react";
import { View, type ViewStyle } from "react-native";
import { useTheme } from "@design";
import { Text } from "@components/primitives";

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  style?: ViewStyle;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  style,
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.xxl,
          gap: theme.spacing.md,
        },
        style,
      ]}
    >
      {icon}
      <Text variant="h3" align="center">{title}</Text>
      {description && (
        <Text variant="body" color="textMuted" align="center">
          {description}
        </Text>
      )}
      {action}
    </View>
  );
};
