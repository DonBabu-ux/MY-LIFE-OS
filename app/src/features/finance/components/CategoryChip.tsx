import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Text, Icon } from "../../../components";
import type { Category } from "@shared/entities";

export type CategoryChipProps = {
  category: Category;
  selected?: boolean;
  onPress?: () => void;
};

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  selected = false,
  onPress,
}) => {
  const theme = useTheme();
  const color = category.color || theme.colors.accent;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? `${color}25` : theme.colors.surface,
          borderColor: selected ? color : theme.colors.border,
        },
      ]}
    >
      {category.icon && (
        <Icon
          name={category.icon}
          size={14}
          color={selected ? color : theme.colors.textMuted}
          style={styles.icon}
        />
      )}
      <Text
        variant="captionStrong"
        color={selected ? "text" : "textMuted"}
        style={styles.label}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 12,
  },
});
