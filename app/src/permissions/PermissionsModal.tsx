import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal } from "react-native";
import { useTheme } from "@design";
import { Text, Icon, Badge, Button, Card } from "../components";
import { useSettingsStore, type PermissionSettings } from "../state/settingsStore";
import { requestAppPermission } from "./requestPermission";

type PermissionItem = {
  key: keyof PermissionSettings;
  title: string;
  desc: string;
  icon: string;
  badge: string;
};

const PERMISSION_ITEMS: PermissionItem[] = [
  {
    key: "notifications",
    title: "Notifications & Alerts",
    desc: "Critical task reminders, focus alerts, and security locks.",
    icon: "notifications",
    badge: "Recommended",
  },
  {
    key: "camera",
    title: "Camera & Receipts",
    desc: "Capture expense receipts for instant offline OCR and diary notes.",
    icon: "camera",
    badge: "Offline Only",
  },
  {
    key: "location",
    title: "Fitness & Location Tracking",
    desc: "Record walking/running routes with zero telemetry.",
    icon: "location",
    badge: "Private GPS",
  },
  {
    key: "contacts",
    title: "Sovereign Contacts Directory",
    desc: "Back up and clean duplicate phonebook contacts locally.",
    icon: "people",
    badge: "Zero-Cloud",
  },
  {
    key: "usage",
    title: "Screen Time & App Limits",
    desc: "Monitor application usage and enforce focus mode rules.",
    icon: "hourglass-outline",
    badge: "Digital Wellbeing",
  },
];

type PermissionsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const PermissionsModal: React.FC<PermissionsModalProps> = ({ visible, onClose }) => {
  const theme = useTheme();
  const permissions = useSettingsStore((s) => s.permissions);
  const togglePermission = useSettingsStore((s) => s.togglePermission);
  const grantAll = useSettingsStore((s) => s.grantAllPermissions);
  const setHasPrompted = useSettingsStore((s) => s.setHasPromptedPermissions);

  const handleGrantAll = async () => {
    // Request real browser/native permissions if available
    await requestAppPermission("notifications");
    await requestAppPermission("location");
    await requestAppPermission("camera");
    grantAll();
    onClose();
  };

  const handleToggle = async (key: keyof PermissionSettings) => {
    if (!permissions[key]) {
      await requestAppPermission(key);
    } else {
      togglePermission(key);
    }
  };

  const handleDone = () => {
    setHasPrompted(true);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleDone}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {/* Top handle pill */}
          <View style={styles.handleWrap}>
            <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.shieldBadge, { backgroundColor: `${theme.colors.accent}18` }]}>
              <Icon name="shield-checkmark" size={24} color={theme.colors.accent} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text variant="title" style={{ color: theme.colors.text }}>
                  Sovereign Permissions
                </Text>
                <Badge label="100% Offline" variant="accent" size="small" />
              </View>
              <Text variant="caption" color="textMuted">
                Personal data never leaves your device. No cloud analytics.
              </Text>
            </View>
          </View>

          {/* Permission Items List */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {PERMISSION_ITEMS.map((item) => {
              const isGranted = !!permissions[item.key];
              return (
                <Card
                  key={item.key}
                  style={[
                    styles.itemCard,
                    {
                      backgroundColor: isGranted ? `${theme.colors.accent}0A` : theme.colors.surfaceAlt,
                      borderColor: isGranted ? `${theme.colors.accent}40` : "transparent",
                    },
                  ]}
                >
                  <View style={[styles.iconBox, { backgroundColor: isGranted ? `${theme.colors.accent}20` : `${theme.colors.textMuted}18` }]}>
                    <Icon
                      name={item.icon}
                      size={20}
                      color={isGranted ? theme.colors.accent : theme.colors.textMuted}
                    />
                  </View>

                  <View style={styles.itemText}>
                    <View style={styles.itemTitleRow}>
                      <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                        {item.title}
                      </Text>
                      <Badge
                        label={item.badge}
                        variant={isGranted ? "accent" : "neutral"}
                        size="small"
                      />
                    </View>
                    <Text variant="caption" color="textMuted">
                      {item.desc}
                    </Text>
                  </View>

                  <Switch
                    value={isGranted}
                    onValueChange={() => handleToggle(item.key)}
                    trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                    thumbColor="#FFF"
                  />
                </Card>
              );
            })}
          </ScrollView>

          {/* Action Footer */}
          <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.colors.accent }]}
              onPress={handleGrantAll}
              activeOpacity={0.85}
            >
              <Icon name="checkmark" size={18} color="#FFF" />
              <Text variant="bodyStrong" style={{ color: "#FFF" }}>
                Allow All Permissions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: theme.colors.border }]}
              onPress={handleDone}
              activeOpacity={0.7}
            >
              <Text variant="body" color="textMuted">
                Confirm Selected
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "88%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 8,
  },
  handleWrap: {
    alignItems: "center",
    paddingVertical: 6,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  shieldBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flexGrow: 0,
    maxHeight: 380,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 10,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  itemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
});

export default PermissionsModal;
