import React from "react";
import { View, StyleSheet, TouchableOpacity, type ViewStyle } from "react-native";
import { useTheme } from "@design";
import { Text } from "../primitives/Text";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";

export type StatTileProps = {
  label: string;
  value: string | number;
  delta?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  icon?: string;
  helperText?: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  delta,
  icon,
  helperText,
  onPress,
  style,
}) => {
  const theme = useTheme();

  const content = (
    <Card style={[styles.card, style]} padding="md">
      <View style={styles.header}>
        <Text variant="caption" color="textMuted">
          {label}
        </Text>
        {icon && (
          <Icon
            name={icon}
            size={18}
            color={theme.colors.textMuted}
          />
        )}
      </View>

      <Text variant="h2" color="text" style={styles.value}>
        {value}
      </Text>

      {delta && (
        <View style={styles.deltaContainer}>
          <Icon
            name={delta.isPositive ? "arrow-up" : "arrow-down"}
            size={14}
            color={delta.isPositive ? theme.colors.income : theme.colors.expense}
          />
          <Text
            variant="captionStrong"
            color={delta.isPositive ? "income" : "expense"}
            style={styles.deltaText}
          >
            {delta.value}
          </Text>
          {delta.label && (
            <Text variant="caption" color="textMuted" style={styles.deltaLabel}>
              {delta.label}
            </Text>
          )}
        </View>
      )}

      {helperText && (
        <Text variant="caption" color="textSubtle" style={styles.helperText}>
          {helperText}
        </Text>
      )}
    </Card>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    minWidth: 140,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  value: {
    marginVertical: 4,
  },
  deltaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  deltaText: {
    marginLeft: 2,
  },
  deltaLabel: {
    marginLeft: 4,
  },
  helperText: {
    marginTop: 4,
  },
});
