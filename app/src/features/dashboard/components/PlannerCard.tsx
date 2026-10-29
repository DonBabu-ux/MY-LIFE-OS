import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Card, Text, Divider, Icon, Badge, ProgressRing } from "../../../components";
import type { DashboardMockData } from "../mock";

export type PlannerCardProps = {
  data: DashboardMockData["planner"];
  onPress: () => void;
};

export const PlannerCard: React.FC<PlannerCardProps> = ({
  data,
  onPress,
}) => {
  const theme = useTheme();
  const completionRatio = data.totalToday > 0 ? data.completedToday / data.totalToday : 0;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card} padding="md">
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Icon name="calendar-outline" size={20} color={theme.colors.accent} />
            <Text variant="h3" style={styles.title}>
              Planner
            </Text>
          </View>
          {data.overdueCount > 0 ? (
            <Badge label={`${data.overdueCount} Overdue`} tone="danger" />
          ) : (
            <Badge label="On Track" tone="success" />
          )}
        </View>

        <View style={styles.contentRow}>
          <View style={styles.taskInfo}>
            <Text variant="caption" color="textMuted">
              Next Scheduled Task
            </Text>
            {data.nextTask ? (
              <View style={styles.taskBlock}>
                <Text variant="bodyStrong" color="text" numberOfLines={1}>
                  {data.nextTask.title}
                </Text>
                <View style={styles.timeRow}>
                  <Icon name="time-outline" size={14} color={theme.colors.textSubtle} />
                  <Text variant="caption" color="textSubtle">
                    {data.nextTask.time}
                  </Text>
                </View>
              </View>
            ) : (
              <Text variant="body" color="textMuted" style={{ marginTop: 4 }}>
                All clear for today
              </Text>
            )}
          </View>

          <View style={styles.ringWrapper}>
            <ProgressRing
              progress={completionRatio}
              size={54}
              strokeWidth={5}
              color={theme.colors.success}
              showPercentText
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.footerRow}>
          <Text variant="caption" color="textMuted">
            {`${data.completedToday} of ${data.totalToday} tasks completed`}
          </Text>
          <View style={styles.arrowRow}>
            <Text variant="captionStrong" color="accent">
              Open Agenda
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskBlock: {
    marginTop: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ringWrapper: {
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
