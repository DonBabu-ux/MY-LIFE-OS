import React from "react";
import { View, StyleSheet, type ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "@design";
import { Text } from "../primitives/Text";

export type ProgressRingProps = {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentText?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 64,
  strokeWidth = 6,
  color,
  backgroundColor,
  label,
  showPercentText = false,
  children,
  style,
}) => {
  const theme = useTheme();

  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeColor = color ?? theme.colors.accent;
  const trackColor = backgroundColor ?? theme.colors.border;

  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        {/* Track circle */}
        <Circle
          stroke={trackColor}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          stroke={strokeColor}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      <View style={styles.centerContent}>
        {children ? (
          children
        ) : showPercentText ? (
          <Text variant="captionStrong" color="text">
            {`${Math.round(clampedProgress * 100)}%`}
          </Text>
        ) : label ? (
          <Text variant="caption" color="textMuted">
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  centerContent: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
