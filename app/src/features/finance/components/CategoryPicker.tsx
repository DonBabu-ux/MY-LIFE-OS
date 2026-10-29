import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "@design";
import { Text, Icon } from "../../../components";
import type { Category } from "@shared/entities";

export type CategoryPickerProps = {
  categories: Category[];
  selectedCategoryId?: string | null;
  onSelectCategory: (category: Category) => void;
};

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.grid}>
      {categories.map((cat) => {
        const isSelected = cat.id === selectedCategoryId;
        const color = cat.color || theme.colors.accent;

        return (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.7}
            onPress={() => onSelectCategory(cat)}
            style={[
              styles.item,
              {
                backgroundColor: isSelected ? `${color}20` : theme.colors.surface,
                borderColor: isSelected ? color : theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${color}30` },
              ]}
            >
              <Icon
                name={cat.icon || "pricetag-outline"}
                size={22}
                color={color}
              />
            </View>
            <Text
              variant="captionStrong"
              color={isSelected ? "text" : "textMuted"}
              numberOfLines={1}
              style={styles.name}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  item: {
    width: "30.5%",
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 11,
    textAlign: "center",
  },
});
