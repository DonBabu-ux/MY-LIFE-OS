/**
 * AddFocusRuleSheet — sheet for creating / editing a Focus Rule.
 * Configures: app, allowed minutes, active hours, days, action.
 * Batch 9.3
 */

import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useTheme } from "@design";
import { Text, Icon, Sheet, Button, Divider } from "../../../components";
import { useUsageStore } from "../state/usageSlice";
import { type FocusRule, formatDuration } from "../mock";

interface AddFocusRuleSheetProps {
  visible: boolean;
  onClose: () => void;
  initialAppId?: string;
  editRule?: FocusRule;
}

const PRESET_MINUTES = [15, 30, 45, 60, 90, 120];
const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const AddFocusRuleSheet: React.FC<AddFocusRuleSheetProps> = ({
  visible,
  onClose,
  initialAppId,
  editRule,
}) => {
  const theme = useTheme();
  const apps = useUsageStore((s) => s.apps);
  const addFocusRule = useUsageStore((s) => s.addFocusRule);
  const updateFocusRule = useUsageStore((s) => s.updateFocusRule);

  const [selectedAppId, setSelectedAppId] = useState<string>(
    editRule?.appId || initialAppId || apps[0]?.id || ""
  );
  const [allowedMinutes, setAllowedMinutes] = useState<number>(
    editRule?.allowedMinutes || 30
  );
  const [startHour, setStartHour] = useState<string>(
    editRule?.activeHours?.start || "09:00"
  );
  const [endHour, setEndHour] = useState<string>(
    editRule?.activeHours?.end || "17:00"
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    editRule?.days || ["Mon", "Tue", "Wed", "Thu", "Fri"]
  );
  const [action, setAction] = useState<"block" | "warn" | "grayscale">(
    editRule?.action || "block"
  );

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = () => {
    const targetApp = apps.find((a) => a.id === selectedAppId);
    if (!targetApp) return;

    if (editRule) {
      updateFocusRule(editRule.id, {
        appId: selectedAppId,
        appName: targetApp.name,
        appIcon: targetApp.icon,
        allowedMinutes,
        activeHours: { start: startHour, end: endHour },
        days: selectedDays,
        action,
      });
    } else {
      addFocusRule({
        appId: selectedAppId,
        appName: targetApp.name,
        appIcon: targetApp.icon,
        allowedMinutes,
        activeHours: { start: startHour, end: endHour },
        days: selectedDays,
        isEnabled: true,
        action,
      });
    }

    onClose();
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={editRule ? "Edit Focus Rule" : "New Focus Rule"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Selection */}
        <Text variant="captionStrong" color="textMuted" style={styles.sectionHeader}>
          TARGET APP
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.appChips}
        >
          {apps.map((app) => {
            const isSelected = app.id === selectedAppId;
            return (
              <TouchableOpacity
                key={app.id}
                onPress={() => setSelectedAppId(app.id)}
                activeOpacity={0.7}
                style={[
                  styles.appChip,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.accentSubtle
                      : theme.colors.surfaceAlt,
                    borderColor: isSelected
                      ? theme.colors.accent
                      : theme.colors.border,
                  },
                ]}
              >
                <Icon
                  name={app.icon as any}
                  size={16}
                  color={isSelected ? theme.colors.accent : theme.colors.textMuted}
                />
                <Text
                  variant="captionStrong"
                  color={isSelected ? "accent" : "text"}
                >
                  {app.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Daily Time Limit */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text variant="captionStrong" color="textMuted">
              DAILY LIMIT
            </Text>
            <Text variant="bodyStrong" color="accent">
              {formatDuration(allowedMinutes)}
            </Text>
          </View>
          <View style={styles.presetRow}>
            {PRESET_MINUTES.map((m) => {
              const isSelected = allowedMinutes === m;
              return (
                <TouchableOpacity
                  key={m}
                  onPress={() => setAllowedMinutes(m)}
                  style={[
                    styles.presetBtn,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.accent
                        : theme.colors.surfaceAlt,
                      borderColor: isSelected
                        ? theme.colors.accent
                        : theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    variant="captionStrong"
                    style={{
                      color: isSelected ? "#FFFFFF" : theme.colors.text,
                    }}
                  >
                    {m < 60 ? `${m}m` : `${m / 60}h`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Active Hours Window */}
        <View style={styles.section}>
          <Text variant="captionStrong" color="textMuted" style={styles.sectionHeader}>
            ACTIVE WINDOW
          </Text>
          <View style={styles.hoursRow}>
            <View style={styles.hourInputGroup}>
              <Text variant="caption" color="textMuted">
                From
              </Text>
              <TextInput
                value={startHour}
                onChangeText={setStartHour}
                placeholder="09:00"
                placeholderTextColor={theme.colors.textSubtle}
                style={[
                  styles.timeInput,
                  {
                    color: theme.colors.text,
                    backgroundColor: theme.colors.surfaceAlt,
                    borderColor: theme.colors.border,
                  },
                ]}
              />
            </View>
            <Text variant="body" color="textMuted" style={{ marginTop: 20 }}>
              to
            </Text>
            <View style={styles.hourInputGroup}>
              <Text variant="caption" color="textMuted">
                To
              </Text>
              <TextInput
                value={endHour}
                onChangeText={setEndHour}
                placeholder="17:00"
                placeholderTextColor={theme.colors.textSubtle}
                style={[
                  styles.timeInput,
                  {
                    color: theme.colors.text,
                    backgroundColor: theme.colors.surfaceAlt,
                    borderColor: theme.colors.border,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Days */}
        <View style={styles.section}>
          <Text variant="captionStrong" color="textMuted" style={styles.sectionHeader}>
            REPEAT ON DAYS
          </Text>
          <View style={styles.daysRow}>
            {ALL_DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[
                    styles.dayPill,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.accent
                        : theme.colors.surfaceAlt,
                      borderColor: isSelected
                        ? theme.colors.accent
                        : theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    variant="captionStrong"
                    style={{
                      color: isSelected ? "#FFFFFF" : theme.colors.textMuted,
                      fontSize: 11,
                    }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Action Type */}
        <View style={styles.section}>
          <Text variant="captionStrong" color="textMuted" style={styles.sectionHeader}>
            ENFORCEMENT ACTION
          </Text>
          <View style={styles.actionsRow}>
            {(["block", "warn", "grayscale"] as const).map((act) => {
              const isSelected = action === act;
              const labels = {
                block: "Block App",
                warn: "Show Warning",
                grayscale: "Grayscale",
              };
              const icons = {
                block: "shield-alert-outline",
                warn: "alert-circle-outline",
                grayscale: "eye-off-outline",
              };
              return (
                <TouchableOpacity
                  key={act}
                  onPress={() => setAction(act)}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.accentSubtle
                        : theme.colors.surfaceAlt,
                      borderColor: isSelected
                        ? theme.colors.accent
                        : theme.colors.border,
                    },
                  ]}
                >
                  <Icon
                    name={icons[act] as any}
                    size={16}
                    color={isSelected ? theme.colors.accent : theme.colors.textMuted}
                  />
                  <Text
                    variant="captionStrong"
                    color={isSelected ? "accent" : "text"}
                    style={{ fontSize: 11 }}
                  >
                    {labels[act]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.btnRow}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={onClose}
            style={styles.btn}
          />
          <Button
            title={editRule ? "Save Changes" : "Create Rule"}
            variant="primary"
            onPress={handleSave}
            style={styles.btn}
          />
        </View>
      </ScrollView>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 12,
  },
  sectionHeader: {
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  section: {
    marginVertical: 4,
  },
  appChips: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 12,
  },
  appChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  presetRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  presetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  divider: {
    marginVertical: 14,
  },
  hoursRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  hourInputGroup: {
    flex: 1,
  },
  timeInput: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 15,
    marginTop: 4,
    textAlign: "center",
    fontWeight: "600",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayPill: {
    width: 40,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  btn: {
    flex: 1,
  },
});
