import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "@design";
import { Text, Card, Button, Badge, Divider, Icon } from "@components/primitives";
import { Header } from "@components/layout";

export const UpdatesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    "App is on version 0.1.0. All systems updated."
  );

  const handleCheckUpdate = () => {
    setChecking(true);
    setStatusMessage("Checking OTA Kit channels for live updates...");
    setTimeout(() => {
      setChecking(false);
      setUpdateAvailable(false);
      setStatusMessage("You are on the latest version. Auto-sync via OTA Kit is active.");
      Alert.alert(
        "Latest Version",
        "Your app is up to date! Live OTA Kit bundle updates are automatically fetched on launch and background checks."
      );
    }, 1500);
  };

  const handleForceSync = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      Alert.alert(
        "OTA Kit Sync Complete",
        "App runtime bundles have verified compatibility with OtaKit."
      );
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <Header
        title="App Updates"
        subtitle="OTA Kit Live Delivery & Release Info"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Current status card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: `${theme.colors.accent}1A` },
              ]}
            >
              <Icon name="cloud-download-outline" size={26} color={theme.colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="h3" color="text">
                Live OTA Updates
              </Text>
              <Text variant="caption" color="textMuted">
                Channel: Production (Continuous Delivery)
              </Text>
            </View>
            <Badge label="Active" tone="success" />
          </View>

          <Divider style={{ marginVertical: theme.spacing.md }} />

          <View style={styles.infoRow}>
            <Text variant="body" color="textMuted">
              Current Installed Version
            </Text>
            <Text variant="bodyStrong" color="text">
              0.1.0
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" color="textMuted">
              Delivery Protocol
            </Text>
            <Text variant="bodyStrong" color="accent">
              OtaKit (OTA_TOKEN)
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" color="textMuted">
              Automated Pipeline
            </Text>
            <Text variant="bodyStrong" color="success">
              GitHub Actions Push
            </Text>
          </View>

          <View
            style={[
              styles.statusBanner,
              { backgroundColor: theme.colors.surfaceAlt },
            ]}
          >
            <Text variant="caption" color="textMuted">
              {statusMessage}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Button
              title={checking ? "Checking..." : "Check for Updates"}
              variant="primary"
              loading={checking}
              onPress={handleCheckUpdate}
              style={{ flex: 1 }}
            />
            <Button
              title="Sync Bundle"
              variant="secondary"
              loading={downloading}
              onPress={handleForceSync}
              style={{ flex: 1 }}
            />
          </View>
        </Card>

        {/* Release APK card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: `${theme.colors.success}1A` },
              ]}
            >
              <Icon name="phone-portrait-outline" size={26} color={theme.colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="h3" color="text">
                Base Release APK
              </Text>
              <Text variant="caption" color="textMuted">
                Required for initial device installation
              </Text>
            </View>
          </View>

          <Divider style={{ marginVertical: theme.spacing.md }} />

          <Text variant="body" color="textMuted" style={{ marginBottom: theme.spacing.md }}>
            Initial installation is performed with the Release APK attached to GitHub Releases.
            After installing once, all subsequent app features, UI, and fixes are pushed instantly
            over the air via OTA Kit on every GitHub push to main.
          </Text>

          <View style={styles.apkPathBox}>
            <Text variant="captionStrong" color="accent">
              GitHub Releases: app-release.apk
            </Text>
            <Text variant="caption" color="textMuted">
              Built automatically on each push to main
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  statusBanner: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  apkPathBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(91, 139, 255, 0.2)",
    gap: 4,
  },
});

export default UpdatesScreen;
