/**
 * RecurrencePicker — sheet-based picker for task recurrence.
 * Preset options + custom placeholder. Batch 8.4
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@design";
import { Text, Icon, Sheet } from "../../../components";
import { RECURRENCE_LABELS, type RecurrencePreset } from "../mock";

const PRESETS: RecurrencePreset[] = [
  "none", "daily", "weekdays", "weekly", "biweekly", "monthly", "custom",
];

const PRESET_ICONS: Record<RecurrencePreset, string> = {
  none:     "close-circle-outline",
  daily:    "sunny-outline",
  weekdays: "briefcase-outline",
  weekly:   "calendar-outline",
  biweekly: "calendar-clear-outline",
  monthly:  "calendar-number-outline",
  custom:   "settings-outline",
};

interface RecurrencePickerProps {
  visible: boolean;
  value: RecurrencePreset;
  onClose: () => void;
  onChange: (value: RecurrencePreset) => void;
}

export const RecurrencePicker: React.FC<RecurrencePickerProps> = ({
  visible,
  value,
  onClose,
  onChange,
}) => {
  const theme = useTheme();

  const handleSelect = (preset: RecurrencePreset) => {
    onChange(preset);
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Repeat">
      <View style={styles.container}>
        {PRESETS.map((preset) => {
          const selected = value === preset;
          const isCustom = preset === "custom";
          return (
            <TouchableOpacity
              key={preset}
              activeOpacity={0.7}
              onPress={() => handleSelect(preset)}
              style={[
                styles.row,
                {
                  backgroundColor: selected ? theme.colors.accentSubtle : "transparent",
                  borderColor: selected ? theme.colors.accent : theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: selected ? theme.colors.accent : theme.colors.surfaceAlt },
                ]}
              >
                <Icon
                  name={PRESET_ICONS[preset]}
                  size={18}
                  color={selected ? theme.colors.onAccent : theme.colors.textMuted}
                />
              </View>
              <View style={styles.rowText}>
                <Text
                  variant="body"
                  color={selected ? "accent" : "text"}
                  style={selected && { fontWeight: "600" }}
                >
                  {RECURRENCE_LABELS[preset]}
                </Text>
                {isCustom && (
                  <Text variant="caption" color="textMuted">
                    Set specific days or intervals
                  </Text>
                )}
              </View>
              {selected && (
                <Icon name="checkmark-circle" size={20} color={theme.colors.accent} />
              )}
            </TouchableOpacity>
          );
        })}
        <Text variant="caption" color="textSubtle" style={styles.note}>
          Custom RRULE support arrives in a future update.
        </Text>
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  note: {
    textAlign: "center",
    marginTop: 8,
  },
});

export default RecurrencePicker;
