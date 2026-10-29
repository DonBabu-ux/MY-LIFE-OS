import React, { useState } from "react";
import { View } from "react-native";
import { Screen } from "@components/layout";
import { Text, Button, Input } from "@components/primitives";
import { useTheme } from "@design";

/**
 * Lock screen  PIN entry gate.
 * Real crypto (hash + keystore) arrives with the security batch.
 * For now: any 4-digit PIN unlocks.
 */
const LockScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | undefined>();

  const onUnlock = () => {
    if (pin.length !== 4) {
      setError("Enter a 4-digit PIN");
      return;
    }
    setError(undefined);
    navigation.replace("Main");
  };

  return (
    <Screen edges={["top", "bottom"]} keyboardAvoid>
      <View style={{ flex: 1, justifyContent: "center", gap: theme.spacing.xl }}>
        <View style={{ alignItems: "center", gap: theme.spacing.sm }}>
          <Text variant="display">M.Y.O.S.</Text>
          <Text variant="body" color="textMuted" align="center">
            My Life Operating System
          </Text>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Input
            label="PIN"
            placeholder=""
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            value={pin}
            onChangeText={(v) => setPin(v.replace(/\D/g, ""))}
            error={error}
          />

          <Button label="Unlock" onPress={onUnlock} fullWidth />

          <Button
            label="Continue without PIN (demo)"
            variant="ghost"
            onPress={() => navigation.replace("Main")}
            fullWidth
          />
        </View>

        <Text variant="caption" color="textSubtle" align="center">
          Your data stays on this device.
        </Text>
      </View>
    </Screen>
  );
};

export default LockScreen;
