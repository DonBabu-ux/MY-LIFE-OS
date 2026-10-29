/**
 * OnboardingScreen — First-Run Setup & Permissions Wizard.
 * Flow:
 *  Step 1: Welcome & Offline-first Manifesto
 *  Step 2: Create Master PIN (using PinKeypad)
 *  Step 3: Device Permissions Walkthrough (mock toggles)
 *  Step 4: Sync & Privacy Consent (per-category opt-in)
 *  Step 5: Completion & Launch
 * Batch 12.1
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useTheme } from "@design";
import {
  Screen,
  Text,
  Card,
  Icon,
  Button,
  Badge,
  PinKeypad,
  Divider,
} from "../components";
import { useSettingsStore } from "../state/settingsStore";
import { Routes } from "../navigation/routes";

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);
  const permissions = useSettingsStore((s) => s.permissions);
  const togglePermission = useSettingsStore((s) => s.togglePermission);
  const syncCategories = useSettingsStore((s) => s.syncCategories);
  const toggleSyncCategory = useSettingsStore((s) => s.toggleSyncCategory);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // PIN state for Step 2
  const [pinStep, setPinStep] = useState<"create" | "confirm">("create");
  const [createdPin, setCreatedPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState<string | undefined>();

  // PIN Keypad handlers
  const handleDigit = (digit: string) => {
    setPinError(undefined);
    if (pinStep === "create") {
      const next = createdPin + digit;
      setCreatedPin(next);
      if (next.length === 4) {
        setTimeout(() => setPinStep("confirm"), 200);
      }
    } else {
      const next = confirmPin + digit;
      setConfirmPin(next);
      if (next.length === 4) {
        if (next === createdPin) {
          setTimeout(() => {
            setCurrentStep(3);
          }, 200);
        } else {
          setTimeout(() => {
            setPinError("PINs do not match. Try again.");
            setConfirmPin("");
          }, 200);
        }
      }
    }
  };

  const handleDelete = () => {
    setPinError(undefined);
    if (pinStep === "create") {
      if (createdPin.length > 0) setCreatedPin(createdPin.slice(0, -1));
    } else {
      if (confirmPin.length > 0) {
        setConfirmPin(confirmPin.slice(0, -1));
      } else {
        setPinStep("create");
      }
    }
  };

  const handleFinish = () => {
    completeOnboarding(createdPin || "1234");
    navigation.replace(Routes.Main);
  };

  const stepsCount = 5;

  return (
    <Screen edges={["top", "bottom"]} style={styles.screen}>
      <View style={styles.wrapper}>
        {/* Step Progress Indicators */}
        <View style={styles.stepProgressRow}>
          {Array.from({ length: stepsCount }).map((_, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <View
                key={idx}
                style={[
                  styles.stepBar,
                  {
                    backgroundColor: isCompleted || isCurrent
                      ? theme.colors.accent
                      : theme.colors.surfaceAlt,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* STEP 1: Welcome Manifesto */}
        {currentStep === 1 && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.welcomeHero}>
              <View
                style={[
                  styles.heroLogoWrap,
                  { backgroundColor: `${theme.colors.accent}20` },
                ]}
              >
                <Icon name="shield-checkmark" size={38} color={theme.colors.accent} />
              </View>
              <Text variant="display" color="text" style={{ textAlign: "center" }}>
                Welcome to My Life OS
              </Text>
              <Text
                variant="body"
                color="textMuted"
                style={{ textAlign: "center", marginTop: 6 }}
              >
                Your private digital command center. Complete control over your money, thoughts, tasks, and habits.
              </Text>
            </View>

            <View style={styles.cardsList}>
              <Card style={styles.featureCard}>
                <View style={styles.featureRow}>
                  <View
                    style={[
                      styles.featIcon,
                      { backgroundColor: `${theme.colors.success}18` },
                    ]}
                  >
                    <Icon name="lock-closed" size={20} color={theme.colors.success} />
                  </View>
                  <View style={styles.featText}>
                    <Text variant="bodyStrong" color="text">
                      100% Offline & Private
                    </Text>
                    <Text variant="caption" color="textMuted">
                      No cloud required. All financial, diary, and contact data stays locally encrypted on this device.
                    </Text>
                  </View>
                </View>
              </Card>

              <Card style={styles.featureCard}>
                <View style={styles.featureRow}>
                  <View
                    style={[
                      styles.featIcon,
                      { backgroundColor: `${theme.colors.accent}18` },
                    ]}
                  >
                    <Icon name="flash" size={20} color={theme.colors.accent} />
                  </View>
                  <View style={styles.featText}>
                    <Text variant="bodyStrong" color="text">
                      Instant & Sovereign
                    </Text>
                    <Text variant="caption" color="textMuted">
                      High-speed SQLite architecture. Operates seamlessly without internet access.
                    </Text>
                  </View>
                </View>
              </Card>

              <Card style={styles.featureCard}>
                <View style={styles.featureRow}>
                  <View
                    style={[
                      styles.featIcon,
                      { backgroundColor: `${theme.colors.warning}18` },
                    ]}
                  >
                    <Icon name="options" size={20} color={theme.colors.warning} />
                  </View>
                  <View style={styles.featText}>
                    <Text variant="bodyStrong" color="text">
                      Granular Permission Controls
                    </Text>
                    <Text variant="caption" color="textMuted">
                      You choose which hardware capabilities to grant. No hidden background telemetries.
                    </Text>
                  </View>
                </View>
              </Card>
            </View>

            <Button
              title="Begin Setup →"
              variant="primary"
              onPress={() => setCurrentStep(2)}
              style={styles.stepBtn}
            />
          </ScrollView>
        )}

        {/* STEP 2: PIN Setup */}
        {currentStep === 2 && (
          <View style={styles.pinStepContainer}>
            <View style={styles.stepHeader}>
              <Text variant="headline" color="text">
                {pinStep === "create" ? "Create Master PIN" : "Confirm Master PIN"}
              </Text>
              <Text variant="caption" color="textMuted" style={{ marginTop: 4 }}>
                {pinStep === "create"
                  ? "Choose a 4-digit code to encrypt and lock your OS."
                  : "Re-enter your 4-digit PIN to confirm."}
              </Text>
            </View>

            <View style={styles.keypadCenter}>
              <PinKeypad
                pin={pinStep === "create" ? createdPin : confirmPin}
                onDigit={handleDigit}
                onDelete={handleDelete}
                error={pinError}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                if (pinStep === "confirm") {
                  setPinStep("create");
                  setCreatedPin("");
                  setConfirmPin("");
                } else {
                  setCurrentStep(1);
                }
              }}
              style={styles.backLink}
            >
              <Text variant="captionStrong" color="textMuted">
                ← Go Back
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: Permissions Walkthrough */}
        {currentStep === 3 && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stepHeader}>
              <Text variant="headline" color="text">
                Device Permissions
              </Text>
              <Text variant="caption" color="textMuted" style={{ marginTop: 4 }}>
                Enable only the capabilities you want My Life OS to utilize.
              </Text>
            </View>

            <Card style={styles.permissionsCard}>
              {/* SMS */}
              <View style={styles.permRow}>
                <View style={styles.permIcon}>
                  <Icon name="mail-outline" size={20} color={theme.colors.accent} />
                </View>
                <View style={styles.permText}>
                  <Text variant="bodyStrong" color="text">
                    SMS Expense Parser
                  </Text>
                  <Text variant="caption" color="textMuted">
                    Extracts bank transactions locally
                  </Text>
                </View>
                <Switch
                  value={permissions.sms}
                  onValueChange={() => togglePermission("sms")}
                  trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.accent }}
                  thumbColor="#FFF"
                />
              </View>

              <Divider />

              {/* Location */}
              <View style={styles.permRow}>
                <View style={styles.permIcon}>
                  <Icon name="navigate-outline" size={20} color={theme.colors.accent} />
                </View>
                <View style={styles.permText}>
                  <Text variant="bodyStrong" color="text">
                    Location & Routes
                  </Text>
                  <Text variant="caption" color="textMuted">
                    Distance calculations for fitness
                  </Text>
                </View>
                <Switch
                  value={permissions.location}
                  onValueChange={() => togglePermission("location")}
                  trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.accent }}
                  thumbColor="#FFF"
                />
              </View>

              <Divider />

              {/* Camera */}
              <View style={styles.permRow}>
                <View style={styles.permIcon}>
                  <Icon name="camera-outline" size={20} color={theme.colors.accent} />
                </View>
                <View style={styles.permText}>
                  <Text variant="bodyStrong" color="text">
                    Camera & Media
                  </Text>
                  <Text variant="caption" color="textMuted">
                    Scan receipts & attach diary photos
                  </Text>
                </View>
                <Switch
                  value={permissions.camera}
                  onValueChange={() => togglePermission("camera")}
                  trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.accent }}
                  thumbColor="#FFF"
                />
              </View>

              <Divider />

              {/* Notifications */}
              <View style={styles.permRow}>
                <View style={styles.permIcon}>
                  <Icon name="notifications-outline" size={20} color={theme.colors.accent} />
                </View>
                <View style={styles.permText}>
                  <Text variant="bodyStrong" color="text">
                    Smart Alerts
                  </Text>
                  <Text variant="caption" color="textMuted">
                    Planner reminders & screen time limits
                  </Text>
                </View>
                <Switch
                  value={permissions.notifications}
                  onValueChange={() => togglePermission("notifications")}
                  trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.accent }}
                  thumbColor="#FFF"
                />
              </View>
            </Card>

            <Button
              title="Continue to Sync Consent →"
              variant="primary"
              onPress={() => setCurrentStep(4)}
              style={styles.stepBtn}
            />
          </ScrollView>
        )}

        {/* STEP 4: Sync & Privacy Consent */}
        {currentStep === 4 && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stepHeader}>
              <Text variant="headline" color="text">
                Sync & Privacy Consent
              </Text>
              <Text variant="caption" color="textMuted" style={{ marginTop: 4 }}>
                All sync is opt-in. Unchecked categories remain strictly local to your phone.
              </Text>
            </View>

            <Card style={styles.permissionsCard}>
              {(
                [
                  { key: "money", label: "Money & Transactions", icon: "cash-outline" },
                  { key: "vault", label: "Vault (Notes & Diary)", icon: "lock-closed-outline" },
                  { key: "plan", label: "Planner & Tasks", icon: "calendar-outline" },
                  { key: "usage", label: "Screen Time & Limits", icon: "hourglass-outline" },
                  { key: "activity", label: "Activity & Fitness", icon: "fitness-outline" },
                  { key: "contacts", label: "Contacts Book", icon: "people-outline" },
                ] as const
              ).map((cat, idx) => (
                <React.Fragment key={cat.key}>
                  {idx > 0 && <Divider />}
                  <View style={styles.permRow}>
                    <View style={styles.permIcon}>
                      <Icon name={cat.icon as any} size={20} color={theme.colors.accent} />
                    </View>
                    <View style={styles.permText}>
                      <Text variant="bodyStrong" color="text">
                        {cat.label}
                      </Text>
                      <Text variant="caption" color="textMuted">
                        {syncCategories[cat.key] ? "E2EE Cloud Sync Active" : "Local Storage Only"}
                      </Text>
                    </View>
                    <Switch
                      value={syncCategories[cat.key]}
                      onValueChange={() => toggleSyncCategory(cat.key)}
                      trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.accent }}
                      thumbColor="#FFF"
                    />
                  </View>
                </React.Fragment>
              ))}
            </Card>

            <Button
              title="Complete Setup →"
              variant="primary"
              onPress={() => setCurrentStep(5)}
              style={styles.stepBtn}
            />
          </ScrollView>
        )}

        {/* STEP 5: All Set */}
        {currentStep === 5 && (
          <View style={styles.doneContainer}>
            <View
              style={[
                styles.doneBadgeCircle,
                { backgroundColor: `${theme.colors.success}18` },
              ]}
            >
              <Icon name="checkmark-done" size={54} color={theme.colors.success} />
            </View>

            <Text variant="display" color="text" style={{ textAlign: "center" }}>
              You are Sovereign.
            </Text>

            <Text
              variant="body"
              color="textMuted"
              style={{ textAlign: "center", marginTop: 8, paddingHorizontal: 16 }}
            >
              My Life OS is now initialized and locked with your Master PIN. Your data is your own.
            </Text>

            <Card style={styles.summaryBox}>
              <View style={styles.summaryItem}>
                <Icon name="shield-checkmark" size={18} color={theme.colors.success} />
                <Text variant="captionStrong" color="text">
                  Master PIN configured
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Icon name="hardware-chip-outline" size={18} color={theme.colors.accent} />
                <Text variant="captionStrong" color="text">
                  Encrypted local database
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Icon name="cloud-offline-outline" size={18} color={theme.colors.textMuted} />
                <Text variant="captionStrong" color="text">
                  Offline-first mode active
                </Text>
              </View>
            </Card>

            <Button
              title="Enter My Life OS"
              variant="primary"
              onPress={handleFinish}
              style={{ width: "100%", marginTop: 24 }}
            />
          </View>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  stepProgressRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  stepBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  scrollContent: {
    paddingBottom: 40,
    gap: 20,
  },
  welcomeHero: {
    alignItems: "center",
    marginVertical: 12,
  },
  heroLogoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardsList: {
    gap: 12,
  },
  featureCard: {
    padding: 14,
    borderRadius: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  featIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featText: {
    flex: 1,
    gap: 2,
  },
  stepHeader: {
    marginBottom: 16,
  },
  pinStepContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 24,
  },
  keypadCenter: {
    width: "100%",
    alignItems: "center",
  },
  backLink: {
    padding: 10,
  },
  permissionsCard: {
    padding: 8,
    borderRadius: 16,
    gap: 4,
  },
  permRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 12,
  },
  permIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  permText: {
    flex: 1,
  },
  stepBtn: {
    marginTop: 8,
  },
  doneContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 32,
  },
  doneBadgeCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  summaryBox: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginTop: 24,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default OnboardingScreen;
export { OnboardingScreen };
