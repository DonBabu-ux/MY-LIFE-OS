import React from "react";
import { View, Pressable } from "react-native";
import { Screen, Header, Section } from "@components/layout";
import { Text, Card, Divider, Badge } from "@components/primitives";
import { useTheme } from "@design";

const Row: React.FC<{ title: string; subtitle?: string; right?: React.ReactNode }> = ({
  title,
  subtitle,
  right,
}) => {
  const theme = useTheme();
  return (
    <Pressable style={{ paddingVertical: theme.spacing.md }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text variant="body">{title}</Text>
          {subtitle && (
            <Text variant="caption" color="textMuted">{subtitle}</Text>
          )}
        </View>
        {right}
      </View>
    </Pressable>
  );
};

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <Screen scroll edges={["top"]}>
      <Header title="Settings" onBack={() => navigation.goBack()} />

      <Section title="Sync">
        <Card padding="none">
          <View style={{ paddingHorizontal: theme.spacing.lg }}>
            <Row title="Transactions" subtitle="Off" right={<Badge label="Local" />} />
            <Divider />
            <Row title="Notes & diary" subtitle="Off" right={<Badge label="Local" />} />
            <Divider />
            <Row title="Contacts" subtitle="Never synced" right={<Badge label="Local" />} />
          </View>
        </Card>
      </Section>

      <Section title="Security">
        <Card padding="none">
          <View style={{ paddingHorizontal: theme.spacing.lg }}>
            <Row title="App lock" subtitle="PIN + biometric" right={<Badge label="On" tone="success" />} />
            <Divider />
            <Row title="Change PIN" />
          </View>
        </Card>
      </Section>

      <Section title="Data">
        <Card padding="none">
          <View style={{ paddingHorizontal: theme.spacing.lg }}>
            <Row title="Export backup" subtitle="Local file only" />
            <Divider />
            <Row title="Import backup" />
            <Divider />
            <Row title="Clear local data" subtitle="Cannot be undone" />
          </View>
        </Card>
      </Section>

      <Section title="About">
        <Card>
          <Text variant="body">MyLifeOS v0.1.0</Text>
          <Text variant="caption" color="textMuted" style={{ marginTop: theme.spacing.xs }}>
            Offline-first  Privacy-first
          </Text>
        </Card>
      </Section>
    </Screen>
  );
};

export default SettingsScreen;
