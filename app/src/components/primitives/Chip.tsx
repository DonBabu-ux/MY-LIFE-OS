import React from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import { useTheme } from "@design";
import { Text } from "./Text";

export type ChipProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  selected?: boolean;
  style?: ViewStyle;
};

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  style,
  ...rest
}) => {
  const theme = useTheme();
  const bg = selected ? theme.colors.accentSubtle : theme.colors.surfaceAlt;
  const fg = selected ? theme.colors.accent : theme.colors.textMuted;

  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: 6,
          borderRadius: theme.radii.pill,
          backgroundColor: bg,
          opacity: pressed ? 0.8 : 1,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Text variant="captionStrong" style={{ color: fg }}>
        {label}
      </Text>
    </Pressable>
  );
};
