import React from "react";
import { Modal, View, type ViewStyle } from "react-native";
import { useTheme } from "@design";
import { Text, Button } from "@components/primitives";

export type DialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  tone?: "neutral" | "danger";
  style?: ViewStyle;
};

export const Dialog: React.FC<DialogProps> = ({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  tone = "neutral",
  style,
}) => {
  const theme = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.overlay,
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.xl,
        }}
      >
        <View
          style={[
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              padding: theme.spacing.xl,
              width: "100%",
              maxWidth: 400,
              gap: theme.spacing.md,
            },
            style,
          ]}
        >
          <Text variant="h3">{title}</Text>
          {message && <Text variant="body" color="textMuted">{message}</Text>}
          <View style={{ flexDirection: "row", gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
            <Button label={cancelLabel} variant="ghost" onPress={onCancel} style={{ flex: 1 }} />
            <Button
              label={confirmLabel}
              variant={tone === "danger" ? "danger" : "primary"}
              onPress={onConfirm}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
