/**
 * MoodPicker — horizontal row of 5 mood options with emoji + label.
 * Batch 7.5
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { useTheme } from "@design";
import { Text } from "../../../components";
import { MOODS, type MoodLevel } from "../mock";

interface MoodPickerProps {
  value: MoodLevel;
  onChange: (level: MoodLevel) => void;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: 40, md: 52, lg: 64 };
const EMOJI_SIZE = { sm: 18, md: 24, lg: 32 };

const MoodButton: React.FC<{
  level: MoodLevel;
  emoji: string;
  label: string;
  color: string;
  selected: boolean;
  size: number;
  emojiSize: number;
  onPress: () => void;
}> = ({ emoji, label, color, selected, size, emojiSize, onPress }) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.2, { damping: 6, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 10 });
    });
    onPress();
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} style={styles.moodBtn}>
      <Animated.View
        style={[
          animStyle,
          styles.emojiWrap,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: selected ? `${color}30` : theme.colors.surface,
            borderWidth: selected ? 2 : 1,
            borderColor: selected ? color : theme.colors.border,
          },
        ]}
      >
        <Text style={{ fontSize: emojiSize, lineHeight: emojiSize + 4 }}>{emoji}</Text>
      </Animated.View>
      <Text
        variant="caption"
        style={[styles.moodLabel, { color: selected ? color : theme.colors.textMuted }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const MoodPicker: React.FC<MoodPickerProps> = ({
  value,
  onChange,
  size = "md",
}) => {
  const btnSize = SIZE_MAP[size];
  const emojiSize = EMOJI_SIZE[size];

  return (
    <View style={styles.row}>
      {MOODS.map((mood) => (
        <MoodButton
          key={mood.level}
          level={mood.level}
          emoji={mood.emoji}
          label={mood.label}
          color={mood.color}
          selected={value === mood.level}
          size={btnSize}
          emojiSize={emojiSize}
          onPress={() => onChange(mood.level)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  moodBtn: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  emojiWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  moodLabel: {
    fontSize: 10,
    textAlign: "center",
  },
});

export default MoodPicker;
