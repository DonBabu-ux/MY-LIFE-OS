import React from "react";
import { Modal, Pressable, type ViewStyle } from "react-native";
import { useTheme } from "@design";

import { Text } from "@components/primitives";

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  style?: ViewStyle;
};

export const Sheet: React.FC<SheetProps> = ({ visible, onClose, children, title, style }) => {
  const theme = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: theme.colors.overlay, justifyContent: "flex-end" }}
      >
        <Pressable
          onPress={() => {}}
          style={[
            {
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.radii.xl,
              borderTopRightRadius: theme.radii.xl,
              padding: theme.spacing.lg,
              paddingBottom: theme.spacing.xxl,
            },
            style,
          ]}
        >
          {title ? (
            <Text variant="h3" style={{ marginBottom: theme.spacing.md }}>
              {title}
            </Text>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

