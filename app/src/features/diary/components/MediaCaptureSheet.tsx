/**
 * MediaCaptureSheet — bottom-sheet for capturing or picking diary media.
 * Camera / Gallery / Voice (UI only, no native modules yet).
 * Batch 7.4
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@design";
import { Text, Icon, Sheet } from "../../../components";
import type { DiaryMedia } from "../mock";

interface MediaCaptureSheetProps {
  visible: boolean;
  onClose: () => void;
  onMediaAdded: (media: DiaryMedia) => void;
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

export const MediaCaptureSheet: React.FC<MediaCaptureSheetProps> = ({
  visible,
  onClose,
  onMediaAdded,
}) => {
  const theme = useTheme();

  const THUMB_COLORS = ["#4F8EF7", "#66BB6A", "#FF7043", "#AB47BC", "#EC407A", "#26A69A"];
  const randomColor = () => THUMB_COLORS[Math.floor(Math.random() * THUMB_COLORS.length)];

  const handle = (type: "image" | "video" | "voice") => {
    onClose();
    setTimeout(() => {
      const stubs: Record<"image" | "video" | "voice", DiaryMedia> = {
        image: {
          id: `dm-stub-${Date.now()}`,
          type: "image",
          uri: "",
          thumbColor: randomColor(),
          caption: "Photo",
        },
        video: {
          id: `dm-stub-${Date.now()}`,
          type: "video",
          uri: "",
          thumbColor: randomColor(),
          durationSec: 15,
          caption: "Video",
        },
        voice: {
          id: `dm-stub-${Date.now()}`,
          type: "voice",
          uri: "",
          thumbColor: randomColor(),
          durationSec: 30,
          caption: "Voice memo",
        },
      };
      onMediaAdded(stubs[type]);
    }, 300);
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Add Media">
      <View style={styles.container}>
        <Text variant="caption" color="textMuted" style={styles.hint}>
          Media is stored locally. Camera and voice require native permissions.
        </Text>

        <ActionRow
          icon="camera-outline"
          label="Take a Photo"
          subtitle="Capture a moment right now"
          color={theme.colors.accent}
          onPress={() => handle("image")}
        />
        <ActionRow
          icon="videocam-outline"
          label="Record a Short Video"
          subtitle="Up to 60 seconds"
          color="#29B6F6"
          onPress={() => handle("video")}
        />
        <ActionRow
          icon="mic-outline"
          label="Record a Voice Memo"
          subtitle="Capture your thoughts by voice"
          color="#AB47BC"
          onPress={() => handle("voice")}
        />
        <ActionRow
          icon="image-outline"
          label="Choose from Gallery"
          subtitle="Pick an existing photo or video"
          color="#66BB6A"
          onPress={() => handle("image")}
        />

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <Text variant="caption" color="textSubtle" style={styles.disclaimer}>
          Native camera & microphone integration arrives in a later batch.
          This UI is a visual preview.
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

export default MediaCaptureSheet;
