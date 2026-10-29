/**
 * FocusRulesScreen — Manage App Limits & Downtime Schedules.
 * Features:
 *  - Overview summary of active rules
 *  - List of configured rules with toggle switch
 *  - Edit & delete actions
 *  - Add rule sheet
 * Batch 9.3
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Icon,
  Badge,
  Button,
  Divider,
} from "../../../components";
import { useUsageStore } from "../state/usageSlice";
import { AddFocusRuleSheet } from "../components/AddFocusRuleSheet";
import { formatDuration, type FocusRule } from "../mock";

export const FocusRulesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<FocusRule | undefined>(undefined);

  const focusRules = useUsageStore((s) => s.focusRules);
  const toggleFocusRule = useUsageStore((s) => s.toggleFocusRule);
  const deleteFocusRule = useUsageStore((s) => s.deleteFocusRule);

  const activeCount = focusRules.filter((r) => r.isEnabled).length;

  const handleEdit = (rule: FocusRule) => {
    setEditingRule(rule);
    setSheetVisible(true);
  };

  const handleAdd = () => {
    setEditingRule(undefined);
    setSheetVisible(true);
  };

  const handleDelete = (rule: FocusRule) => {
    Alert.alert(
      "Delete Focus Rule",
      `Are you sure you want to remove the limit for ${rule.appName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteFocusRule(rule.id),
        },
      ]
    );
  };

  return (
    <Screen style={styles.screen}>
      <Header
        title="Focus Rules"
        subtitle="Limits & Downtime"
        showBack
        rightAction={{
          icon: "add-circle-outline",
          onPress: handleAdd,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Summary Banner */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <View
              style={[
                styles.summaryIcon,
                { backgroundColor: `${theme.colors.accent}20` },
              ]}
            >
              <Icon
                name="shield-checkmark"
                size={24}
                color={theme.colors.accent}
              />
            </View>
            <View>
              <Text variant="headline" color="text">
                {activeCount} of {focusRules.length} Rules Active
              </Text>
              <Text variant="caption" color="textMuted">
                Automated app blocking & reminders
              </Text>
            </View>
          </View>

          <Badge
            label={activeCount > 0 ? "Protected" : "Inactive"}
            variant={activeCount > 0 ? "success" : "neutral"}
            size="small"
          />
        </Card>

        {/* Rules List Section */}
        <View style={styles.listHeaderRow}>
          <Text variant="captionStrong" color="textMuted">
            CONFIGURED LIMITS ({focusRules.length})
          </Text>
        </View>

        {focusRules.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Icon
              name="hourglass-outline"
              size={48}
              color={theme.colors.textSubtle}
            />
            <Text variant="title" color="text" style={{ marginTop: 12 }}>
              No Focus Rules Yet
            </Text>
            <Text
              variant="caption"
              color="textMuted"
              style={{ textAlign: "center", marginTop: 4, paddingHorizontal: 20 }}
            >
              Set daily time limits on distracting apps to protect your focus and deep work hours.
            </Text>
            <Button
              title="+ Create First Rule"
              variant="primary"
              onPress={handleAdd}
              style={{ marginTop: 16 }}
            />
          </Card>
        ) : (
          <View style={styles.rulesList}>
            {focusRules.map((rule) => {
              const actionColors = {
                block: theme.colors.error,
                warn: theme.colors.warning,
                grayscale: theme.colors.accent,
              };
              const actionLabels = {
                block: "Block App",
                warn: "Warning",
                grayscale: "Grayscale",
              };

              return (
                <Card key={rule.id} style={styles.ruleCard}>
                  <View style={styles.ruleTopRow}>
                    {/* App Icon */}
                    <View
                      style={[
                        styles.ruleAppIconWrap,
                        { backgroundColor: theme.colors.surfaceAlt },
                      ]}
                    >
                      <Icon
                        name={rule.appIcon as any}
                        size={20}
                        color={theme.colors.accent}
                      />
                    </View>

                    {/* App & Limit Meta */}
                    <View style={styles.ruleInfo}>
                      <View style={styles.titleLine}>
                        <Text variant="bodyStrong" color="text">
                          {rule.appName}
                        </Text>
                        <Badge
                          label={actionLabels[rule.action]}
                          variant={rule.action === "block" ? "error" : "warning"}
                          size="small"
                        />
                      </View>
                      <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
                        {formatDuration(rule.allowedMinutes)} daily limit
                      </Text>
                    </View>

                    {/* Switch Toggle */}
                    <Switch
                      value={rule.isEnabled}
                      onValueChange={() => toggleFocusRule(rule.id)}
                      trackColor={{
                        false: theme.colors.surfaceAlt,
                        true: theme.colors.accent,
                      }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  <Divider style={styles.ruleDivider} />

                  {/* Active Window & Days */}
                  <View style={styles.ruleBottomRow}>
                    <View style={styles.scheduleInfo}>
                      <Icon
                        name="time-outline"
                        size={14}
                        color={theme.colors.textMuted}
                      />
                      <Text variant="caption" color="textMuted">
                        {rule.activeHours.start} - {rule.activeHours.end}
                      </Text>
                      <Text variant="caption" color="textSubtle">
                        •
                      </Text>
                      <Text variant="caption" color="textMuted">
                        {rule.days.length === 7
                          ? "Every day"
                          : rule.days.length === 5 && !rule.days.includes("Sat")
                          ? "Weekdays"
                          : rule.days.join(", ")}
                      </Text>
                    </View>

                    {/* Action buttons: Edit & Delete */}
                    <View style={styles.ruleActions}>
                      <TouchableOpacity
                        onPress={() => handleEdit(rule)}
                        style={styles.iconBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Icon
                          name="pencil"
                          size={16}
                          color={theme.colors.accent}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(rule)}
                        style={styles.iconBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Icon
                          name="trash-outline"
                          size={16}
                          color={theme.colors.error}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {/* Add Rule Floating / Bottom CTA */}
        {focusRules.length > 0 && (
          <Button
            title="+ Add Another Focus Rule"
            variant="secondary"
            onPress={handleAdd}
            style={{ marginTop: 8 }}
          />
        )}
      </ScrollView>

      {/* Add / Edit Rule Sheet */}
      <AddFocusRuleSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        editRule={editingRule}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
  },
  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  listHeaderRow: {
    marginTop: 6,
  },
  emptyCard: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  rulesList: {
    gap: 12,
  },
  ruleCard: {
    padding: 14,
    borderRadius: 14,
  },
  ruleTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ruleAppIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  ruleInfo: {
    flex: 1,
  },
  titleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ruleDivider: {
    marginVertical: 10,
  },
  ruleBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scheduleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  ruleActions: {
    flexDirection: "row",
    gap: 12,
    marginLeft: 8,
  },
  iconBtn: {
    padding: 4,
  },
});
