import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Card, Text, Divider, Icon, Badge } from "../../../components";
import type { DashboardMockData } from "../mock";

export type MoneySummaryCardProps = {
  data: DashboardMockData["money"];
  onPress: () => void;
};

export const MoneySummaryCard: React.FC<MoneySummaryCardProps> = ({
  data,
  onPress,
}) => {
  const theme = useTheme();

  const spentFormatted = `${data.currency} ${(data.spentTodayMinor / 100).toLocaleString()}`;
  const receivedFormatted = `+${data.currency} ${(data.receivedTodayMinor / 100).toLocaleString()}`;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card} padding="md">
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Icon name="wallet-outline" size={20} color={theme.colors.accent} />
            <Text variant="h3" style={styles.title}>
              Money
            </Text>
          </View>
          <Badge label="Today" tone="neutral" />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricColumn}>
            <Text variant="caption" color="textMuted">
              Spent today
            </Text>
            <Text variant="h1" color="text" style={styles.mainAmount}>
              {spentFormatted}
            </Text>
          </View>
          <View style={[styles.metricColumn, styles.rightMetric]}>
            <Text variant="caption" color="textMuted">
              Received
            </Text>
            <Text variant="h2" color="income" style={styles.receivedAmount}>
              {receivedFormatted}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.footerRow}>
          <Text variant="caption" color="textMuted">
            {`${data.recentTransactions.length} transactions today`}
          </Text>
          <View style={styles.arrowRow}>
            <Text variant="captionStrong" color="accent">
              View Cashflow
            </Text>
            <Icon name="chevron-forward" size={14} color={theme.colors.accent} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    marginLeft: 4,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  metricColumn: {
    flex: 1,
  },
  rightMetric: {
    alignItems: "flex-end",
  },
  mainAmount: {
    marginTop: 4,
  },
  receivedAmount: {
    marginTop: 4,
  },
  divider: {
    marginVertical: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});
