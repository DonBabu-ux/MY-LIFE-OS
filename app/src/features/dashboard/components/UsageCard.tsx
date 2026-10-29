import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Card, Text, Divider, Icon, Sparkline } from "../../../components";
import type { DashboardMockData } from "../mock";

export type UsageCardProps = {
  data: DashboardMockData["phoneUsage"];
  onPress: () => void;
};

export const UsageCard: React.FC<UsageCardProps> = ({
  data,
  onPress,
}) => {
  const theme = useTheme();

  const hours = Math.floor(data.screenTimeMinutes / 60);
  const mins = data.screenTimeMinutes % 60;
  const screenTimeText = `${hours}h ${mins}m`;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card} padding="md">
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Icon name="phone-portrait-outline" size={20} color={theme.colors.accent} />
            <Text variant="h3" style={styles.title}>
              Phone Usage
            </Text>
          </View>
          <Text variant="caption" color="textMuted">
            {`Goal: ${Math.floor(data.screenTimeTargetMinutes / 60)}h limit`}
          </Text>
        </View>

        <View style={styles.contentRow}>
          <View>
            <Text variant="caption" color="textMuted">
              Screen time today
            </Text>
            <Text variant="h1" color="text" style={styles.timeValue}>
              {screenTimeText}
            </Text>
            <View style={styles.topAppRow}>
              <Icon name={data.topApp.icon} size={14} color={theme.colors.accent} />
              <Text variant="captionStrong" color="text">
                {`${data.topApp.name} (${Math.floor(data.topApp.durationMinutes / 60)}h ${data.topApp.durationMinutes % 60}m)`}
              </Text>
            </View>
          </View>

          <View style={styles.sparklineContainer}>
            <Text variant="caption" color="textSubtle" style={styles.trendLabel}>
              Hourly Activity
            </Text>
            <Sparkline
              data={data.trend}
              width={110}
              height={36}
              color={theme.colors.accent}
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.footerRow}>
          <Text variant="caption" color="textMuted">
            Privacy: On-device tracking only
          </Text>
          <View style={styles.arrowRow}>
            <Text variant="captionStrong" color="accent">
              Focus Rules
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
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  timeValue: {
    marginTop: 4,
  },
  topAppRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  sparklineContainer: {
    alignItems: "flex-end",
  },
  trendLabel: {
    marginBottom: 4,
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
