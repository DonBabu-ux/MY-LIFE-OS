import React from "react";
import { View } from "react-native";
import { Screen } from "@components/layout";
import { Text, Button, Card } from "@components/primitives";
import { useTheme } from "@design";

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <Screen scroll edges={["top", "bottom"]}>
      <View style={{ gap: theme.spacing.xxl }}>
        <View style={{ gap: theme.spacing.sm }}>
          <Text variant="display">Welcome</Text>
          <Text variant="body" color="textMuted">
            MyLifeOS keeps your money, notes, diary, tasks and activity in one
            private place  on your device.
          </Text>
        </View>

        <Card>
          <Text variant="h3">Private by default</Text>
          <View style={{ height: theme.spacing.sm }} />
          <Text variant="body" color="textMuted">
            Nothing leaves your phone unless you explicitly turn on sync for a
            category.
          </Text>
        </Card>

        <Card>
          <Text variant="h3">Works offline</Text>
          <View style={{ height: theme.spacing.sm }} />
          <Text variant="body" color="textMuted">
            Every core feature works with zero internet. The cloud is optional.
          </Text>
        </Card>

        <Card>
          <Text variant="h3">You control permissions</Text>
          <View style={{ height: theme.spacing.sm }} />
          <Text variant="body" color="textMuted">
            SMS, contacts, location, activity  requested only when you enable
            the related feature.
          </Text>
        </Card>

        <Button
          label="Continue"
          onPress={() => navigation.replace("Lock")}
          fullWidth
        />
      </View>
    </Screen>
  );
};

export default OnboardingScreen;
