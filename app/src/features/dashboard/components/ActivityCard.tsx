import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Card, Text, Divider, Icon, ProgressRing } from "../../../components";
import type { DashboardMockData } from "../mock";

export type ActivityCardProps = {
  data: DashboardMockData["activity"];
  onPress: () => void;
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  data,
  onPress,
}) => {
  const theme = useTheme();
  const stepRatio = data.stepsTarget > 0 ? data.steps / data.stepsTarget : 0;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card} padding="md">
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Icon name="walk-outline" size={20} color={theme.colors.accent} />
            <Text variant="h3" style={styles.title}>
              Activity
            </Text>
          </View>
          <Text variant="caption" color="textMuted">
            {`Target: ${data.stepsTarget.toLocaleString()} steps`}
          </Text>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.leftMetrics}>
            <View>
              <Text variant="caption" color="textMuted">
                Steps today
              </Text>
              <Text variant="h1" color="text" style={styles.stepsText}>
                {data.steps.toLocaleString()}
              </Text>
            </View>

            <View style={styles.subStatsRow}>
              <View style={styles.subStat}>
                <Text variant="caption" color="textMuted">
                  Distance
                </Text>
                <Text variant="bodyStrong" color="text">
                  {`${data.distanceKm} km`}
                </Text>
              </View>
              <View style={styles.subStat}>
                <Text variant="caption" color="textMuted">
                  Active Time
                </Text>
                <Text variant="bodyStrong" color="text">
                  {`${data.activeMinutes} min`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.ringWrapper}>
            <ProgressRing
              progress={stepRatio}
              size={56}
              strokeWidth={5}
              color={theme.colors.accent}
              showPercentText
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.footerRow}>
          <Text variant="caption" color="textMuted">
            {`${Math.max(0, data.stepsTarget - data.steps).toLocaleString()} steps remaining`}
          </Text>
          <View style={styles.arrowRow}>
            <Text variant="captionStrong" color="accent">
              View History
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
    alignItems: "center",
  },
  leftMetrics: {
    flex: 1,
  },
  stepsText: {
    marginTop: 4,
  },
  subStatsRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  subStat: {
    gap: 2,
  },
  ringWrapper: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
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
