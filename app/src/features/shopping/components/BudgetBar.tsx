import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@design";
import { Text, Badge } from "../../../components";

export type BudgetBarProps = {
  estimatedTotalMinor: number;
  actualTotalMinor: number;
  budgetMinor: number;
};

export const BudgetBar: React.FC<BudgetBarProps> = ({
  estimatedTotalMinor,
  actualTotalMinor,
  budgetMinor,
}) => {
  const theme = useTheme();

  const effectiveTotal = actualTotalMinor > 0 ? actualTotalMinor : estimatedTotalMinor;
  const ratio = budgetMinor > 0 ? effectiveTotal / budgetMinor : 0;
  const clampedPercent = Math.min(Math.round(ratio * 100), 100);
  const isOver = budgetMinor > 0 && effectiveTotal > budgetMinor;
  const isWarning = !isOver && ratio >= 0.85;

  const barColor = isOver
    ? theme.colors.danger
    : isWarning
    ? theme.colors.warning
    : theme.colors.accent;

  const formatAmount = (minor: number) =>
    `KES ${(minor / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const remainingMinor = budgetMinor - effectiveTotal;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceAlt }]}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View>
          <Text variant="captionStrong" color="textMuted">
            {actualTotalMinor > 0 ? "SPENT VS BUDGET" : "ESTIMATED VS BUDGET"}
          </Text>
          <Text variant="h3" color="text">
            {`${formatAmount(effectiveTotal)} / ${formatAmount(budgetMinor)}`}
          </Text>
        </View>

        <Badge
          label={
            isOver
              ? `Over by ${formatAmount(Math.abs(remainingMinor))}`
              : `${formatAmount(remainingMinor)} left`
          }
          tone={isOver ? "danger" : isWarning ? "warning" : "success"}
        />
      </View>

      {/* Progress Track */}
      <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(clampedPercent, 100)}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>

      {/* Bottom Percentage */}
      <View style={styles.footerRow}>
        <Text variant="caption" color="textMuted">
          {actualTotalMinor > 0
            ? `Purchased: ${formatAmount(actualTotalMinor)}`
            : `Est. Total: ${formatAmount(estimatedTotalMinor)}`}
        </Text>
        <Text variant="captionStrong" color={isOver ? "danger" : "textMuted"}>
          {`${Math.round(ratio * 100)}%`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 14,
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 2,
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default BudgetBar;
