/**
 * AppCategoryPicker — sheet-based picker to assign an app category.
 * Batch 9.4
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@design";
import { Text, Icon, Sheet } from "../../../components";
import { APP_CATEGORIES, type AppCategory } from "../mock";

interface AppCategoryPickerProps {
  visible: boolean;
  value: AppCategory;
  onClose: () => void;
  onChange: (value: AppCategory) => void;
}

const CATEGORY_KEYS: AppCategory[] = [
  "social",
  "productivity",
  "entertainment",
  "communication",
  "utilities",
  "finance",
  "health",
  "other",
];

export const AppCategoryPicker: React.FC<AppCategoryPickerProps> = ({
  visible,
  value,
  onClose,
  onChange,
}) => {
  const theme = useTheme();

  const handleSelect = (category: AppCategory) => {
    onChange(category);
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Assign Category">
      <View style={styles.container}>
        {CATEGORY_KEYS.map((catKey) => {
          const cat = APP_CATEGORIES[catKey];
          const selected = value === catKey;
          return (
            <TouchableOpacity
              key={catKey}
              activeOpacity={0.7}
              onPress={() => handleSelect(catKey)}
              style={[
                styles.row,
                {
                  backgroundColor: selected
                    ? theme.colors.accentSubtle
                    : "transparent",
                  borderColor: selected ? theme.colors.accent : theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${cat.color}20` },
                ]}
              >
                <Icon name={cat.icon as any} size={18} color={cat.color} />
              </View>

              <View style={styles.labelCol}>
                <Text
                  variant="bodyStrong"
                  color={selected ? "accent" : "text"}
                >
                  {cat.label}
                </Text>
              </View>

              {selected && (
                <Icon
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.accent}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  labelCol: {
    flex: 1,
  },
});
