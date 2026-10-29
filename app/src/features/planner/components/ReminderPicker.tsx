/**
 * ReminderPicker — sheet-based picker for task reminders.
 * Multi-select: add multiple reminder offsets. Batch 8.5
 */

import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@design";
import { Text, Icon, Sheet, Button } from "../../../components";
import { REMINDER_OPTIONS, type Reminder } from "../mock";

interface ReminderPickerProps {
  visible: boolean;
  reminders: Reminder[];
  onClose: () => void;
  onChange: (reminders: Reminder[]) => void;
}

export const ReminderPicker: React.FC<ReminderPickerProps> = ({
  visible,
  reminders,
  onClose,
  onChange,
}) => {
  const theme = useTheme();
  const [selected, setSelected] = useState<number[]>(
    reminders.map((r) => r.minutesBefore)
  );

  // Re-sync when sheet opens
  React.useEffect(() => {
    if (visible) setSelected(reminders.map((r) => r.minutesBefore));
  }, [visible, reminders]);

  const toggle = (minutes: number) => {
    setSelected((prev) =>
      prev.includes(minutes)
        ? prev.filter((m) => m !== minutes)
        : [...prev, minutes]
    );
  };

  const handleApply = () => {
    const newReminders: Reminder[] = selected.map((minutes) => ({
      id: `rem-${minutes}-${Date.now()}`,
      minutesBefore: minutes,
    }));
    onChange(newReminders);
    onClose();
  };

  const formatLabel = (minutes: number) => {
    return REMINDER_OPTIONS.find((o) => o.value === minutes)?.label ?? `${minutes} min`;
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Reminders">
      <View style={styles.container}>
        <Text variant="caption" color="textMuted" style={styles.subtitle}>
          Select one or more reminders. You'll receive a notification at each.
        </Text>

        {REMINDER_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <TouchableOpacity
              key={opt.value}
              activeOpacity={0.7}
              onPress={() => toggle(opt.value)}
              style={[
                styles.row,
                {
                  backgroundColor: isSelected ? theme.colors.accentSubtle : "transparent",
                  borderColor: isSelected ? theme.colors.accent : theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.checkBox,
                  {
                    backgroundColor: isSelected ? theme.colors.accent : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.accent : theme.colors.border,
                  },
                ]}
              >
                {isSelected && (
                  <Icon name="checkmark" size={14} color={theme.colors.onAccent} />
                )}
              </View>
              <Icon
                name="notifications-outline"
                size={18}
                color={isSelected ? theme.colors.accent : theme.colors.textMuted}
              />
              <Text variant="body" color={isSelected ? "accent" : "text"}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {selected.length > 0 && (
          <View style={[styles.summary, { backgroundColor: theme.colors.accentSubtle }]}>
            <Icon name="notifications" size={16} color={theme.colors.accent} />
            <Text variant="captionStrong" color="accent">
              {selected.length} reminder{selected.length !== 1 ? "s" : ""} set:{" "}
              {selected
                .sort((a, b) => a - b)
                .map(formatLabel)
                .join(", ")}
            </Text>
          </View>
        )}

        {selected.length === 0 && (
          <View style={[styles.summary, { backgroundColor: theme.colors.surfaceAlt }]}>
            <Icon name="notifications-off-outline" size={16} color={theme.colors.textMuted} />
            <Text variant="captionStrong" color="textMuted">No reminders</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button label="Cancel" variant="ghost" onPress={onClose} style={styles.btn} />
          <Button label="Apply" variant="primary" onPress={handleApply} style={styles.btn} />
        </View>
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  btn: {
    flex: 1,
  },
});

export default ReminderPicker;
