import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import { Screen, Header, Text, Icon, Badge, Card, Divider } from "../components";
import { Routes } from "../navigation/routes";
import { PermissionsModal } from "../permissions";
import { useSettingsStore } from "../state/settingsStore";

export const MoreHubScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);

  const permissions = useSettingsStore((s) => s.permissions);
  const grantedCount = Object.values(permissions).filter(Boolean).length;
  const totalPermissions = Object.keys(permissions).length;
  const exportBackupJson = useSettingsStore((s) => s.exportBackupJson);
  const lastBackupTime = useSettingsStore((s) => s.lastBackupTime);

  const handleExportBackup = () => {
    const json = exportBackupJson();
    Alert.alert(
      "Sovereign Backup Created",
      `Encrypted local backup generated successfully.\nSize: ${(json.length / 1024).toFixed(1)} KB\nDestination: Local Offline Vault`,
      [{ text: "OK" }]
    );
  };

  return (
    <Screen edges={["top"]} style={styles.screen}>
      <Header
        title="Control Hub"
        subtitle="System, Security & Features"
        right={<Badge label="Offline" variant="neutral" size="small" />}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Sovereign Status Banner */}
        <Card style={[styles.statusCard, { backgroundColor: `${theme.colors.accent}14`, borderColor: `${theme.colors.accent}30` }]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusIconWrap, { backgroundColor: theme.colors.accent }]}>
              <Icon name="shield-checkmark" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                  My Life OS Sovereign Core
                </Text>
                <Badge label="Active" variant="accent" size="small" />
              </View>
              <Text variant="caption" color="textMuted">
                Zero Cloud • 100% On-Device Encryption • SQLite
              </Text>
            </View>
          </View>
        </Card>

        {/* 2. System & Privacy Control Cards */}
        <View style={styles.section}>
          <Text variant="captionStrong" color="textMuted" style={styles.sectionTitle}>
            SYSTEM & PRIVACY
          </Text>

          <Card style={styles.groupCard}>
            {/* Full Settings Page */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate(Routes.Settings)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#6366F120" }]}>
                <Icon name="settings-outline" size={20} color="#6366F1" />
              </View>
              <View style={styles.actionTextCol}>
                <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                  Settings
                </Text>
                <Text variant="caption" color="textMuted">
                  Master PIN, Auto-Lock, Theme, Appearance & Sync
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>

            <Divider />

            {/* Permissions Center */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => setPermissionsModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#10B98120" }]}>
                <Icon name="shield-checkmark-outline" size={20} color="#10B981" />
              </View>
              <View style={styles.actionTextCol}>
                <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                  Permissions & Privacy Center
                </Text>
                <Text variant="caption" color="textMuted">
                  {grantedCount} of {totalPermissions} permissions granted
                </Text>
              </View>
              <Badge
                label={grantedCount === totalPermissions ? "All Granted" : `${grantedCount}/${totalPermissions}`}
                variant={grantedCount === totalPermissions ? "accent" : "neutral"}
                size="small"
              />
            </TouchableOpacity>

            <Divider />

            {/* OTA Updates */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate(Routes.Updates)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#06B6D420" }]}>
                <Icon name="cloud-download-outline" size={20} color="#06B6D4" />
              </View>
              <View style={styles.actionTextCol}>
                <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                  App Updates & OTA Kit
                </Text>
                <Text variant="caption" color="textMuted">
                  Live Over-The-Air releases & build info
                </Text>
              </View>
              <Badge label="v0.1.0" variant="neutral" size="small" />
            </TouchableOpacity>

            <Divider />

            {/* Data Vault & Backups */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleExportBackup}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#F59E0B20" }]}>
                <Icon name="download-outline" size={20} color="#F59E0B" />
              </View>
              <View style={styles.actionTextCol}>
                <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                  Export Encrypted Backup
                </Text>
                <Text variant="caption" color="textMuted">
                  Last: {lastBackupTime}
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* 3. Core Apps & Modules */}
        <View style={styles.section}>
          <Text variant="captionStrong" color="textMuted" style={styles.sectionTitle}>
            APPLICATIONS & MODULES
          </Text>

          <Card style={styles.groupCard}>
            {/* Screen Time & Usage */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate(Routes.UsageDashboard)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#8B5CF620" }]}>
                <Icon name="hourglass-outline" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.actionTextCol}>
                <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                  Screen Time & Focus Rules
                </Text>
                <Text variant="caption" color="textMuted">
                  Application usage analytics & distraction limits
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>

            <Divider />

            {/* Fitness & Activity */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate(Routes.ActivityDashboard)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#EC489920" }]}>
                <Icon name="fitness-outline" size={20} color="#EC4899" />
              </View>
              <View style={styles.actionTextCol}>
                <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                  Fitness & Activity Tracker
                </Text>
                <Text variant="caption" color="textMuted">
                  Daily step goals, workouts & GPS routes
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>

            <Divider />

            {/* Sovereign Contacts */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate(Routes.ContactsList)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#3B82F620" }]}>
                <Icon name="people-outline" size={20} color="#3B82F6" />
              </View>
              <View style={styles.actionTextCol}>
                <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                  Sovereign Contacts Directory
                </Text>
                <Text variant="caption" color="textMuted">
                  Encrypted contacts, phonebook & duplicate cleaner
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>

            <Divider />

            {/* Component Playground */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate(Routes.Playground)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#14B8A620" }]}>
                <Icon name="cube-outline" size={20} color="#14B8A6" />
              </View>
              <View style={styles.actionTextCol}>
                <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                  UI Component Lab
                </Text>
                <Text variant="caption" color="textMuted">
                  Interactive design system primitives & tokens
                </Text>
              </View>
              <Badge label="Lab" variant="neutral" size="small" />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>

      {/* Permissions Modal */}
      <PermissionsModal
        visible={permissionsModalVisible}
        onClose={() => setPermissionsModalVisible(false)}
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
    gap: 18,
    paddingBottom: 40,
  },
  statusCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  groupCard: {
    padding: 4,
    borderRadius: 18,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTextCol: {
    flex: 1,
    gap: 2,
  },
});

export default MoreHubScreen;
