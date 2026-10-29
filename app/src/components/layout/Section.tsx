import React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "@design";
import { Text } from "@components/primitives";

export type SectionProps = ViewProps & {
  title?: string;
  action?: React.ReactNode;
  gap?: number;
  style?: ViewStyle;
};

export const Section: React.FC<SectionProps> = ({
  title,
  action,
  gap,
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();
  return (
    <View
      {...rest}
      style={[{ marginBottom: theme.spacing.xxl }, style]}
    >
      {(title || action) && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.md,
          }}
        >
          {title && <Text variant="h3">{title}</Text>}
          {action}
        </View>
      )}
      <View style={{ gap: gap ?? theme.spacing.md }}>{children}</View>
    </View>
  );
};
