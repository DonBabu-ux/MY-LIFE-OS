/**
 * MoodPicker — horizontal row of 5 mood options with emoji + label.
 * Batch 7.5
 */

import React, { useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
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
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.25, friction: 3, tension: 150, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 150, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} style={styles.moodBtn}>
      <Animated.View
        style={[
          { transform: [{ scale }] },
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

export const MoodPicker: React.FC<MoodPickerProps> = ({ value, onChange, size = "md" }) => {
  const btnSize = SIZE_MAP[size];
  const emojiSize = EMOJI_SIZE[size];

  return (
    <View style={styles.container}>
      {MOODS.map((m) => (
        <MoodButton
          key={m.level}
          level={m.level}
          emoji={m.emoji}
          label={m.label}
          color={m.color}
          selected={value === m.level}
          size={btnSize}
          emojiSize={emojiSize}
          onPress={() => onChange(m.level)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  moodBtn: {
    alignItems: "center",
    gap: 4,
  },
  emojiWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  moodLabel: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "600",
  },
});

export default MoodPicker;
