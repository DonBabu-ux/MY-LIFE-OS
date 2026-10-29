import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "@design";
import { Text } from "../../../components";
import type { Category } from "@shared/entities";

export type CategoryBreakdownItem = {
  category: Category;
  totalMinor: number;
  percentage: number;
};

export type CategoryBreakdownProps = {
  items: CategoryBreakdownItem[];
  totalExpenseMinor?: number;
};

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  items,
}) => {
  const theme = useTheme();

  if (!items || items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="caption" color="textMuted">
          No expense breakdown available yet.
        </Text>
      </View>
    );
  }

  // Calculate donut segments
  const size = 130;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <View style={styles.container}>
      {/* Donut Chart */}
      <View style={styles.donutWrapper}>
        <Svg width={size} height={size}>
          <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {/* Background ring */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.colors.border}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {items.map((item, idx) => {
              const strokeDasharray = `${circumference * item.percentage} ${circumference}`;
              const strokeDashoffset = -circumference * cumulativePercent;
              cumulativePercent += item.percentage;
              const color = item.category.color || theme.colors.accent;

              return (
                <Circle
                  key={item.category.id || idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="none"
                />
              );
            })}
          </G>
        </Svg>
        <View style={styles.centerText}>
          <Text variant="captionStrong" color="text">
            Top
          </Text>
          <Text variant="caption" color="textMuted">
            Categories
          </Text>
        </View>
      </View>

      {/* Legend list */}
      <View style={styles.legendWrapper}>
        {items.slice(0, 4).map((item) => {
          const color = item.category.color || theme.colors.accent;
          const pct = Math.round(item.percentage * 100);

          return (
            <View key={item.category.id} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text variant="captionStrong" color="text" numberOfLines={1} style={styles.categoryName}>
                {item.category.name}
              </Text>
              <Text variant="caption" color="textMuted" style={styles.categoryPercent}>
                {`${pct}%`}
              </Text>
              <Text variant="captionStrong" color="text">
                {`KES ${(item.totalMinor / 100).toLocaleString()}`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  emptyContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  donutWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  legendWrapper: {
    flex: 1,
    marginLeft: 20,
    gap: 8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
  },
  categoryPercent: {
    marginHorizontal: 8,
  },
});
