/**
 * SettingsScreen — Security, Sync, Appearance, Backups, and System Options.
 * Features:
 *  - Security: Change PIN, Biometric toggle, Auto-lock timeout, Lock Now
 *  - Sync: Per-category opt-in sync toggles
 *  - Appearance: Theme selection (Dark / Light / System), Reduced Motion
 *  - Export/Backup: JSON backup export with timestamp & size, Clear data
 *  - Developer: Component Playground, Rerun Onboarding
 *  - About: Version, Licenses, Privacy policy
 * Batch 12.3
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
  Sheet,
  PinKeypad,
} from "../components";
import { useSettingsStore, type SyncCategorySettings } from "../state/settingsStore";
import { Routes } from "../navigation/routes";

const SettingRow: React.FC<{
  icon: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}> = ({ icon, title, subtitle, right, onPress, destructive = false }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={styles.settingRow}
    >
      <View
        style={[
          styles.rowIconWrap,
          {
            backgroundColor: destructive
              ? `${theme.colors.error}18`
              : theme.colors.surfaceAlt,
          },
        ]}
      >
        <Icon
          name={icon as any}
          size={18}
          color={destructive ? theme.colors.error : theme.colors.accent}
        />
      </View>

      <View style={styles.rowTextCol}>
        <Text
          variant="bodyStrong"
          style={{ color: destructive ? theme.colors.error : theme.colors.text }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color="textMuted">
            {subtitle}
          </Text>
        )}
      </View>

      {right}
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();

  const pin = useSettingsStore((s) => s.pin);
  const setPin = useSettingsStore((s) => s.setPin);
  const isBiometricEnabled = useSettingsStore((s) => s.isBiometricEnabled);
  const setBiometricEnabled = useSettingsStore((s) => s.setBiometricEnabled);
  const autoLockTimeout = useSettingsStore((s) => s.autoLockTimeout);
  const setAutoLockTimeout = useSettingsStore((s) => s.setAutoLockTimeout);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const setReducedMotion = useSettingsStore((s) => s.setReducedMotion);
  const syncCategories = useSettingsStore((s) => s.syncCategories);
  const toggleSyncCategory = useSettingsStore((s) => s.toggleSyncCategory);
  const lastBackupTime = useSettingsStore((s) => s.lastBackupTime);
  const exportBackupJson = useSettingsStore((s) => s.exportBackupJson);
  const clearAllLocalData = useSettingsStore((s) => s.clearAllLocalData);

  // Change PIN modal state
  const [changePinVisible, setChangePinVisible] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinChangeError, setPinChangeError] = useState<string | undefined>();

  const handleNewPinDigit = (d: string) => {
    setPinChangeError(undefined);
    const next = newPin + d;
    setNewPin(next);
    if (next.length === 4) {
      setPin(next);
      setTimeout(() => {
        setChangePinVisible(false);
        setNewPin("");
        Alert.alert("Success", "Master PIN updated successfully.");
      }, 200);
    }
  };

  const handleExportBackup = () => {
    const json = exportBackupJson();
    Alert.alert(
      "Backup Created",
      `Encrypted local backup generated successfully.\nSize: ${(json.length / 1024).toFixed(1)} KB\nDestination: Local Storage / Backups`,
      [{ text: "OK" }]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear Local Data",
      "This will erase your local settings and reset sync configurations. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Erase Everything",
          style: "destructive",
          onPress: () => {
            clearAllLocalData();
            Alert.alert("Data Cleared", "Local database has been reset.");
          },
        },
      ]
    );
  };

  const timeouts: Array<"immediate" | "1min" | "5min" | "15min" | "never"> = [
    "immediate",
    "1min",
    "5min",
    "15min",
    "never",
  ];

  return (
    <Screen edges={["top"]} style={styles.screen}>
      <Header
        title="Settings"
        subtitle="System & Preferences"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Security Section */}
        <View style={styles.section}>
          <Text variant="captionStrong" color="textMuted" style={styles.sectionTitle}>
            SECURITY & APP LOCK
          </Text>
          <Card style={styles.card}>
            <SettingRow
              icon="key-outline"
              title="Change Master PIN"
              subtitle={`Current PIN: ${pin.replace(/./g, "•")}`}
              right={<Icon name="chevron-forward" size={16} color={theme.colors.textSubtle} />}
              onPress={() => {
                setNewPin("");
                setChangePinVisible(true);
              }}
            />

            <Divider />

            <SettingRow
              icon="finger-print-outline"
              title="Biometric Unlock"
              subtitle="Face ID & Fingerprint"
              right={
                <Switch
                  value={isBiometricEnabled}
                  onValueChange={setBiometricEnabled}
                  trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.accent }}
                  thumbColor="#FFF"
                />
              }
            />

            <Divider />

            {/* Auto Lock Timeout */}
            <View style={styles.timeoutBlock}>
              <Text variant="bodyStrong" color="text">
                Auto-Lock Timeout
              </Text>
              <View style={styles.timeoutPillsRow}>
                {timeouts.map((t) => {
                  const isSelected = autoLockTimeout === t;
                  const label = t === "immediate" ? "0m" : t;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setAutoLockTimeout(t)}
                      style={[
                        styles.timeoutPill,
                        {
                          backgroundColor: isSelected
                            ? theme.colors.accent
                            : theme.colors.surfaceAlt,
                        },
                      ]}
                    >
                      <Text
                        variant="captionStrong"
                        style={{
                          color: isSelected ? "#FFF" : theme.colors.textMuted,
                          fontSize: 11,
                        }}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Divider />

            <SettingRow
              icon="lock-closed-outline"
              title="Lock Application Now"
              subtitle="Returns immediately to PIN screen"
              right={<Icon name="log-out-outline" size={18} color={theme.colors.accent} />}
              onPress={() => navigation.replace(Routes.Lock)}
            />
          </Card>
        </View>

        {/* 2. Sync Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text variant="captionStrong" color="textMuted">
              END-TO-END ENCRYPTED SYNC
            </Text>
            <Badge label="Zero Cloud Default" variant="neutral" size="small" />
          </View>

          <Card style={styles.card}>
            {(
              [
                { key: "money", label: "Money & Accounts", icon: "cash-outline" },
                { key: "vault", label: "Vault (Notes & Diary)", icon: "lock-closed-outline" },
                { key: "plan", label: "Tasks & Planner", icon: "calendar-outline" },
                { key: "usage", label: "Screen Time & Limits", icon: "hourglass-outline" },
                { key: "activity", label: "Activity & Fitness", icon: "fitness-outline" },
                { key: "contacts", label: "Contacts Directory", icon: "people-outline" },
              ] as const
            ).map((cat, idx) => (
              <React.Fragment key={cat.key}>
                {idx > 0 && <Divider />}
                <SettingRow
                  icon={cat.icon}
                  title={cat.label}
                  subtitle={syncCategories[cat.key] ? "Syncing (Encrypted)" : "Stored Locally Only"}
                  right={
                    <Switch
                      value={syncCategories[cat.key]}
                      onValueChange={() => toggleSyncCategory(cat.key)}
                      trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.accent }}
                      thumbColor="#FFF"
                    />
                  }
                />
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* 3. Appearance Section */}
        <View style={styles.section}>
          <Text variant="captionStrong" color="textMuted" style={styles.sectionTitle}>
            APPEARANCE & ACCESSIBILITY
          </Text>
          <Card style={styles.card}>
            {/* Theme Selector */}
            <View style={styles.themeSelectorRow}>
              <Text variant="bodyStrong" color="text">
                Theme
              </Text>
              <View style={styles.themePills}>
                {(["dark", "light", "system"] as const).map((mode) => {
                  const isSelected = themeMode === mode;
                  return (
                    <TouchableOpacity
                      key={mode}
                      onPress={() => setThemeMode(mode)}
                      style={[
                        styles.themePill,
                        {
                          backgroundColor: isSelected
                            ? theme.colors.accent
                            : theme.colors.surfaceAlt,
                        },
                      ]}
                    >
                      <Text
                        variant="captionStrong"
                        style={{
                          color: isSelected ? "#FFF" : theme.colors.textMuted,
                          fontSize: 11,
                          textTransform: "capitalize",
                        }}
                      >
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Divider />

            <SettingRow
              icon="speedometer-outline"
              title="Reduced Motion"
              subtitle="Minimizes UI transition animations"
              right={
                <Switch
                  value={reducedMotion}
                  onValueChange={setReducedMotion}
                  trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.accent }}
                  thumbColor="#FFF"
                />
              }
            />
          </Card>
        </View>

        {/* 4. Export & Backups */}
        <View style={styles.section}>
          <Text variant="captionStrong" color="textMuted" style={styles.sectionTitle}>
            DATA & BACKUPS
          </Text>
          <Card style={styles.card}>
            <SettingRow
              icon="download-outline"
              title="Export Encrypted Backup"
              subtitle={`Last backup: ${lastBackupTime}`}
              right={<Icon name="chevron-forward" size={16} color={theme.colors.textSubtle} />}
              onPress={handleExportBackup}
            />

            <Divider />

            <SettingRow
              icon="cloud-upload-outline"
              title="Import Backup File"
              subtitle="Restore from local JSON archive"
              right={<Icon name="chevron-forward" size={16} color={theme.colors.textSubtle} />}
              onPress={() =>
                Alert.alert(
                  "Import Backup",
                  "Select a valid MyLifeOS .json export file from your local storage to restore.",
                  [{ text: "Browse Files" }, { text: "Cancel", style: "cancel" }]
                )
              }
            />

            <Divider />

            <SettingRow
              icon="trash-outline"
              title="Clear Local Data"
              subtitle="Erases cache and resets preferences"
              destructive
              right={<Icon name="alert-circle-outline" size={18} color={theme.colors.error} />}
              onPress={handleClearData}
            />
          </Card>
        </View>

        {/* 5. Developer & Diagnostics */}
        <View style={styles.section}>
          <Text variant="captionStrong" color="textMuted" style={styles.sectionTitle}>
            DEVELOPER & DIAGNOSTICS
          </Text>
          <Card style={styles.card}>
            <SettingRow
              icon="cube-outline"
              title="UI Component Playground"
              subtitle="Preview all design primitives & components"
              right={<Badge label="Test Lab" variant="accent" size="small" />}
              onPress={() => navigation.navigate(Routes.Playground)}
            />

            <Divider />

            <SettingRow
              icon="refresh-outline"
              title="Re-run Onboarding Walkthrough"
              subtitle="Experience the first-run wizard again"
              right={<Icon name="chevron-forward" size={16} color={theme.colors.textSubtle} />}
              onPress={() => navigation.navigate(Routes.Onboarding)}
            />
          </Card>
        </View>

        {/* 6. About Section */}
        <View style={styles.section}>
          <Text variant="captionStrong" color="textMuted" style={styles.sectionTitle}>
            ABOUT
          </Text>
          <Card style={styles.card}>
            <View style={styles.aboutHeader}>
              <View
                style={[
                  styles.aboutLogo,
                  { backgroundColor: `${theme.colors.accent}18` },
                ]}
              >
                <Icon name="shield-checkmark" size={24} color={theme.colors.accent} />
              </View>
              <View>
                <Text variant="bodyStrong" color="text">
                  My Life OS
                </Text>
                <Text variant="caption" color="textMuted">
                  Version 0.1.0 • Offline-First Sovereign OS
                </Text>
              </View>
            </View>

            <Divider />

            <SettingRow
              icon="cloud-download-outline"
              title="App Updates & OTA Kit"
              subtitle="Live over-the-air updates & release info"
              right={<Icon name="chevron-forward" size={16} color={theme.colors.accent} />}
              onPress={() => navigation.navigate(Routes.Updates)}
            />

            <Divider />

            <SettingRow
              icon="document-text-outline"
              title="Privacy Policy & Manifesto"
              subtitle="Zero analytics, telemetry, or remote trackers"
              right={<Icon name="open-outline" size={16} color={theme.colors.accent} />}
              onPress={() =>
                Alert.alert(
                  "Privacy Manifesto",
                  "My Life OS is built on the principle of sovereign data ownership. Your personal records never leave your device without explicit end-to-end cryptographic keys under your exclusive control."
                )
              }
            />

            <Divider />

            <SettingRow
              icon="code-slash-outline"
              title="Open Source Licenses"
              subtitle="MIT License • React Native, SQLite, Zustand"
              right={<Icon name="chevron-forward" size={16} color={theme.colors.textSubtle} />}
              onPress={() =>
                Alert.alert(
                  "Licenses",
                  "My Life OS is built using open-source libraries: React Native, OP-SQLite, Zustand, Lucide/Ionicons, React Navigation."
                )
              }
            />
          </Card>
        </View>
      </ScrollView>

      {/* Change PIN Sheet */}
      <Sheet
        visible={changePinVisible}
        onClose={() => setChangePinVisible(false)}
        title="Set New Master PIN"
      >
        <View style={styles.pinSheetContent}>
          <Text variant="caption" color="textMuted" style={{ textAlign: "center", marginBottom: 12 }}>
            Enter a new 4-digit PIN to secure your app.
          </Text>

          <PinKeypad
            pin={newPin}
            onDigit={handleNewPinDigit}
            onDelete={() => {
              if (newPin.length > 0) setNewPin(newPin.slice(0, -1));
            }}
            error={pinChangeError}
          />
        </View>
      </Sheet>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 20,
    paddingBottom: 48,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    padding: 8,
    borderRadius: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 12,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTextCol: {
    flex: 1,
    gap: 2,
  },
  timeoutBlock: {
    padding: 10,
    gap: 8,
  },
  timeoutPillsRow: {
    flexDirection: "row",
    gap: 6,
  },
  timeoutPill: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: 8,
  },
  themeSelectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  themePills: {
    flexDirection: "row",
    gap: 6,
  },
  themePill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 12,
  },
  aboutLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pinSheetContent: {
    paddingVertical: 12,
    alignItems: "center",
  },
});

export default SettingsScreen;
export { SettingsScreen };
