import React from "react";
import { View } from "react-native";
import { Screen, Header, Section } from "@components/layout";
import { Text, Card, Chip, Badge, Divider, Button } from "@components/primitives";
import { useTheme } from "@design";

/**
 * The dashboard  "what's happening in my life today?".
 * Uses placeholder data for now; wired to SQLite in the db batch.
 */
const DashboardScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <Screen scroll edges={["top"]}>
      <Header
        title="Today"
        subtitle="Tuesday, 24 Sep"
        right={<Badge label="Offline" tone="neutral" />}
      />

      {/* MONEY */}
      <Section title="Money">
        <Card>
          <View style={{ gap: theme.spacing.md }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View>
                <Text variant="caption" color="textMuted">Spent today</Text>
                <Text variant="h1">KSh 0</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text variant="caption" color="textMuted">Received</Text>
                <Text variant="h2" color="success">KSh 0</Text>
              </View>
            </View>
            <Divider />
            <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
              <Chip label="Add transaction" />
              <Chip label="Scan receipt" />
            </View>
          </View>
        </Card>
      </Section>

      {/* PLANNER */}
      <Section title="Planner">
        <Card>
          <View style={{ gap: theme.spacing.sm }}>
            <Text variant="body" color="textMuted">Nothing scheduled yet</Text>
            <Button label="Add a task" variant="secondary" size="sm" fullWidth />
          </View>
        </Card>
      </Section>

      {/* PHONE */}
      <Section title="Phone">
        <Card>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text variant="caption" color="textMuted">Screen time</Text>
              <Text variant="h2"></Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text variant="caption" color="textMuted">Top app</Text>
              <Text variant="h3"></Text>
            </View>
          </View>
        </Card>
      </Section>

      {/* ACTIVITY */}
      <Section title="Activity">
        <Card>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text variant="caption" color="textMuted">Steps</Text>
              <Text variant="h2">0</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text variant="caption" color="textMuted">Distance</Text>
              <Text variant="h3">0.0 km</Text>
            </View>
          </View>
        </Card>
      </Section>

      {/* VAULT */}
      <Section title="Vault">
        <Card>
          <View style={{ gap: theme.spacing.sm }}>
            <Text variant="body" color="textMuted">
              No notes or diary entries yet.
            </Text>
            <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
              <Chip label="New note" />
              <Chip label="New entry" />
            </View>
          </View>
        </Card>
      </Section>
    </Screen>
  );
};

export default DashboardScreen;
