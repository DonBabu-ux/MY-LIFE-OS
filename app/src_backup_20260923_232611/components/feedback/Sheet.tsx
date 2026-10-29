import React from "react";
import { Modal, Pressable, type ViewStyle } from "react-native";
import { useTheme } from "@design";

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

export const Sheet: React.FC<SheetProps> = ({ visible, onClose, children, style }) => {
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
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

