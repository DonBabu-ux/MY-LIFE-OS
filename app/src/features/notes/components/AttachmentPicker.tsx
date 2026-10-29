/**
 * AttachmentPicker — bottom-sheet style picker for image / PDF / camera attachments.
 * Opens a Sheet with action rows. Actual file access is stubbed (UI only).
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@design";
import { Text, Icon, Sheet } from "../../../components";

interface AttachmentPickerProps {
  visible: boolean;
  onClose: () => void;
  onPickImage?: () => void;
  onPickPdf?: () => void;
  onCapture?: () => void;
}

interface ActionRowProps {
  icon: string;
  label: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

const ActionRow: React.FC<ActionRowProps> = ({ icon, label, subtitle, color, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.actionRow, { borderColor: theme.colors.border }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${color}20` }]}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <View style={styles.actionText}>
        <Text variant="body">{label}</Text>
        <Text variant="caption" color="textMuted">{subtitle}</Text>
      </View>
      <Icon name="chevron-forward" size={18} color={theme.colors.textMuted} />
    </TouchableOpacity>
  );
};

export const AttachmentPicker: React.FC<AttachmentPickerProps> = ({
  visible,
  onClose,
  onPickImage,
  onPickPdf,
  onCapture,
}) => {
  const theme = useTheme();

  const handleAction = (cb?: () => void) => {
    onClose();
    setTimeout(() => cb?.(), 300);
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Add Attachment">
      <View style={styles.container}>
        <Text variant="caption" color="textMuted" style={styles.hint}>
          Attachments are stored locally on your device.
        </Text>

        <ActionRow
          icon="camera-outline"
          label="Take a Photo"
          subtitle="Capture now with your camera"
          color={theme.colors.accent}
          onPress={() => handleAction(onCapture)}
        />
        <ActionRow
          icon="image-outline"
          label="Choose from Gallery"
          subtitle="Pick an existing image"
          color="#4F8EF7"
          onPress={() => handleAction(onPickImage)}
        />
        <ActionRow
          icon="document-outline"
          label="Choose a PDF"
          subtitle="Pick a PDF document"
          color="#FF7043"
          onPress={() => handleAction(onPickPdf)}
        />

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <Text variant="caption" color="textSubtle" style={styles.disclaimer}>
          File picker integration requires native modules (Batch 13).
          This UI is a preview.
        </Text>
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  hint: {
    textAlign: "center",
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    flex: 1,
    gap: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  disclaimer: {
    textAlign: "center",
    lineHeight: 16,
  },
});

export default AttachmentPicker;
