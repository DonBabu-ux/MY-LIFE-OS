/**
 * ActivityHistoryScreen — Calendar Heatmap & Historical Activity Records.
 * Features:
 *  - View mode switcher: Heatmap vs List
 *  - 28-day Calendar Heatmap grid with 5 intensity levels
 *  - Interactive day selection displaying selected day stats
 *  - Monthly summary stats (total steps, days target hit, daily average)
 *  - Full chronological list view with goal completion indicators
 * Batch 10.2
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Icon,
  Badge,
  Divider,
  Button,
} from "../../../components";
import { useActivityStore } from "../state/activitySlice";
import { type ActivityDay } from "../mock";

export const ActivityHistoryScreen: React.FC = () => {
  const theme = useTheme();
  const history = useActivityStore((s) => s.history);

  const [viewMode, setViewMode] = useState<"heatmap" | "list">("heatmap");
  const [selectedDay, setSelectedDay] = useState<ActivityDay>(history[0]);

  // Summary calculations
  const totalSteps = history.reduce((sum, d) => sum + d.steps, 0);
  const totalDistance = history.reduce((sum, d) => sum + d.distanceKm, 0);
  const daysTargetHit = history.filter((d) => d.goalAchieved).length;
  const avgDailySteps = Math.round(totalSteps / (history.length || 1));

  // Intensity color generator
  const getLevelColor = (level: number, achieved: boolean) => {
    if (achieved) return theme.colors.success;
    switch (level) {
      case 0:
        return theme.colors.surfaceAlt;
      case 1:
        return `${theme.colors.accent}33`;
      case 2:
        return `${theme.colors.accent}66`;
      case 3:
        return `${theme.colors.accent}AA`;
      case 4:
        return theme.colors.accent;
      default:
        return theme.colors.surfaceAlt;
    }
  };

  const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Screen style={styles.screen}>
      <Header title="Activity History" subtitle="Consistency & Trends" showBack />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* View Mode Toggle */}
        <View style={[styles.toggleContainer, { backgroundColor: theme.colors.surfaceAlt }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setViewMode("heatmap")}
            style={[
              styles.toggleBtn,
              viewMode === "heatmap" && {
                backgroundColor: theme.colors.surface,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
            ]}
          >
            <Icon
              name="grid-outline"
              size={16}
              color={viewMode === "heatmap" ? theme.colors.accent : theme.colors.textMuted}
            />
            <Text
              variant="captionStrong"
              color={viewMode === "heatmap" ? "text" : "textMuted"}
            >
              Heatmap
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setViewMode("list")}
            style={[
              styles.toggleBtn,
              viewMode === "list" && {
                backgroundColor: theme.colors.surface,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
            ]}
          >
            <Icon
              name="list-outline"
              size={16}
              color={viewMode === "list" ? theme.colors.accent : theme.colors.textMuted}
            />
            <Text
              variant="captionStrong"
              color={viewMode === "list" ? "text" : "textMuted"}
            >
              List View
            </Text>
          </TouchableOpacity>
        </View>

        {/* Period Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <Text variant="caption" color="textMuted">
                Total Steps
              </Text>
              <Text variant="title" color="text">
                {totalSteps.toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryCol}>
              <Text variant="caption" color="textMuted">
                Goals Hit
              </Text>
              <Text variant="title" color="text">
                {daysTargetHit} / {history.length}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryCol}>
              <Text variant="caption" color="textMuted">
                Daily Avg
              </Text>
              <Text variant="title" color="text">
                {avgDailySteps.toLocaleString()}
              </Text>
            </View>
          </View>
        </Card>

        {viewMode === "heatmap" ? (
          <>
            {/* Calendar Heatmap Card */}
            <Card style={styles.heatmapCard}>
              <View style={styles.heatmapHeader}>
                <Text variant="title" color="text">
                  Past 4 Weeks Heatmap
                </Text>
                <Text variant="caption" color="textMuted">
                  Tap any day to view metrics
                </Text>
              </View>

              {/* Day of Week Headers */}
              <View style={styles.dayHeadersRow}>
                {dayHeaders.map((d, i) => (
                  <View key={i} style={styles.dayHeaderCell}>
                    <Text variant="captionStrong" color="textSubtle" style={{ fontSize: 11 }}>
                      {d}
                    </Text>
                  </View>
                ))}
              </View>

              {/* 28-Day Grid */}
              <View style={styles.gridContainer}>
                {history.map((day) => {
                  const isSelected = selectedDay?.date === day.date;
                  const cellColor = getLevelColor(day.level, day.goalAchieved);

                  return (
                    <TouchableOpacity
                      key={day.date}
                      activeOpacity={0.7}
                      onPress={() => setSelectedDay(day)}
                      style={[
                        styles.gridCell,
                        {
                          backgroundColor: cellColor,
                          borderColor: isSelected
                            ? theme.colors.text
                            : "transparent",
                          borderWidth: isSelected ? 2 : 0,
                        },
                      ]}
                    >
                      {day.goalAchieved && (
                        <Icon name="checkmark" size={10} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Intensity Legend */}
              <View style={styles.legendRow}>
                <Text variant="caption" color="textSubtle" style={{ fontSize: 10 }}>
                  Less
                </Text>
                <View style={[styles.legendBox, { backgroundColor: theme.colors.surfaceAlt }]} />
                <View style={[styles.legendBox, { backgroundColor: `${theme.colors.accent}44` }]} />
                <View style={[styles.legendBox, { backgroundColor: `${theme.colors.accent}88` }]} />
                <View style={[styles.legendBox, { backgroundColor: theme.colors.accent }]} />
                <View style={[styles.legendBox, { backgroundColor: theme.colors.success }]} />
                <Text variant="caption" color="textSubtle" style={{ fontSize: 10 }}>
                  Target Hit
                </Text>
              </View>
            </Card>

            {/* Selected Day Detail Card */}
            {selectedDay && (
              <Card style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <View>
                    <Text variant="title" color="text">
                      {selectedDay.date} ({selectedDay.dayLabel})
                    </Text>
                    <Text variant="caption" color="textMuted">
                      Target: {selectedDay.stepsTarget.toLocaleString()} steps
                    </Text>
                  </View>
                  <Badge
                    label={selectedDay.goalAchieved ? "Goal Achieved" : "Under Target"}
                    variant={selectedDay.goalAchieved ? "success" : "neutral"}
                    size="small"
                  />
                </View>

                <Divider style={{ marginVertical: 12 }} />

                <View style={styles.detailMetricsRow}>
                  <View style={styles.detailMetricCol}>
                    <Text variant="display" color="text" style={{ fontSize: 24 }}>
                      {selectedDay.steps.toLocaleString()}
                    </Text>
                    <Text variant="caption" color="textMuted">
                      Steps
                    </Text>
                  </View>

                  <View style={styles.detailMetricCol}>
                    <Text variant="title" color="text">
                      {selectedDay.distanceKm} km
                    </Text>
                    <Text variant="caption" color="textMuted">
                      Distance
                    </Text>
                  </View>

                  <View style={styles.detailMetricCol}>
                    <Text variant="title" color="text">
                      {selectedDay.activeMinutes}m
                    </Text>
                    <Text variant="caption" color="textMuted">
                      Active Time
                    </Text>
                  </View>

                  <View style={styles.detailMetricCol}>
                    <Text variant="title" color="text">
                      {selectedDay.caloriesBurned}
                    </Text>
                    <Text variant="caption" color="textMuted">
                      Calories
                    </Text>
                  </View>
                </View>
              </Card>
            )}
          </>
        ) : (
          /* List View */
          <View style={styles.listContainer}>
            {history.map((day) => {
              const progressPercent = Math.min(
                100,
                Math.round((day.steps / day.stepsTarget) * 100)
              );

              return (
                <Card key={day.date} style={styles.listCard}>
                  <View style={styles.listTopRow}>
                    <View style={styles.dateCol}>
                      <Text variant="bodyStrong" color="text">
                        {day.dayLabel}, {day.date.slice(5)}
                      </Text>
                      <Text variant="caption" color="textMuted">
                        {day.distanceKm} km • {day.activeMinutes} min • {day.caloriesBurned} kcal
                      </Text>
                    </View>

                    <View style={styles.stepsBadge}>
                      <Text variant="headline" color="text">
                        {day.steps.toLocaleString()}
                      </Text>
                      {day.goalAchieved && (
                        <Icon
                          name="checkmark-circle"
                          size={18}
                          color={theme.colors.success}
                        />
                      )}
                    </View>
                  </View>

                  {/* Progress bar toward 10k target */}
                  <View
                    style={[
                      styles.progressBarTrack,
                      { backgroundColor: theme.colors.surfaceAlt },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${progressPercent}%`,
                          backgroundColor: day.goalAchieved
                            ? theme.colors.success
                            : theme.colors.accent,
                        },
                      ]}
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  toggleContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
  },
  heatmapCard: {
    padding: 16,
    borderRadius: 16,
  },
  heatmapHeader: {
    marginBottom: 16,
  },
  dayHeadersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayHeaderCell: {
    width: 36,
    alignItems: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  gridCell: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    marginTop: 18,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  detailCard: {
    padding: 16,
    borderRadius: 16,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailMetricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailMetricCol: {
    alignItems: "center",
    gap: 2,
  },
  listContainer: {
    gap: 10,
  },
  listCard: {
    padding: 14,
    borderRadius: 14,
    gap: 10,
  },
  listTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateCol: {
    flex: 1,
    gap: 2,
  },
  stepsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 2.5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2.5,
  },
});
