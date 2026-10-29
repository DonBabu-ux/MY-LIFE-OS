/**
 * ActivityDashboardScreen — Movement, Steps, & Daily Fitness Overview.
 * Features:
 *  - ProgressRing for daily step target completion
 *  - Distance, Active Minutes, and Calories burned stats
 *  - 24-hour hourly movement histogram
 *  - 7-day weekly trend with goal achievement indicators
 *  - Recent workouts / recorded sessions
 *  - LocationToggle integration
 *  - Navigation to ActivityHistoryScreen
 * Batch 10.1
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Icon,
  Badge,
  ProgressRing,
  Divider,
} from "../../../components";
import { useActivityStore } from "../state/activitySlice";
import { LocationToggle } from "../components/LocationToggle";
import { Routes } from "../../../navigation/routes";

export const ActivityDashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  const today = useActivityStore((s) => s.today);
  const weekly = useActivityStore((s) => s.weekly);
  const workouts = useActivityStore((s) => s.workouts);
  const getWeeklyAverageSteps = useActivityStore((s) => s.getWeeklyAverageSteps);

  const stepRatio = today.stepsTarget > 0 ? today.steps / today.stepsTarget : 0;
  const weeklyAvg = getWeeklyAverageSteps();
  const maxWeeklySteps = Math.max(...weekly.map((d) => d.steps), today.stepsTarget);
  const maxHourSteps = Math.max(...today.hourlySteps, 1);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <Screen style={styles.screen}>
      <Header
        title="Activity"
        subtitle="Movement & Fitness"
        rightAction={{
          icon: "calendar-outline",
          onPress: () => navigation.navigate(Routes.ActivityHistory),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
          />
        }
      >
        {/* Main Hero Card with ProgressRing */}
        <Card style={styles.heroCard}>
          <View style={styles.ringWrapper}>
            <ProgressRing
              progress={stepRatio}
              size={150}
              strokeWidth={12}
              color={theme.colors.accent}
              backgroundColor={theme.colors.surfaceAlt}
            >
              <View style={styles.ringInner}>
                <Icon name="footsteps" size={20} color={theme.colors.accent} />
                <Text variant="display" color="text" style={styles.stepsText}>
                  {today.steps.toLocaleString()}
                </Text>
                <Text variant="caption" color="textMuted">
                  of {today.stepsTarget.toLocaleString()} steps
                </Text>
              </View>
            </ProgressRing>
          </View>

          <Divider style={styles.heroDivider} />

          {/* 3 Metric Tiles: Distance, Active Time, Calories */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <View
                style={[
                  styles.metricIconWrap,
                  { backgroundColor: `${theme.colors.accent}15` },
                ]}
              >
                <Icon
                  name="navigate-outline"
                  size={16}
                  color={theme.colors.accent}
                />
              </View>
              <Text variant="headline" color="text">
                {today.distanceKm} <Text variant="caption" color="textMuted">km</Text>
              </Text>
              <Text variant="caption" color="textMuted">
                Distance
              </Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <View
                style={[
                  styles.metricIconWrap,
                  { backgroundColor: `${theme.colors.success}15` },
                ]}
              >
                <Icon
                  name="time-outline"
                  size={16}
                  color={theme.colors.success}
                />
              </View>
              <Text variant="headline" color="text">
                {today.activeMinutes} <Text variant="caption" color="textMuted">min</Text>
              </Text>
              <Text variant="caption" color="textMuted">
                Active Time
              </Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <View
                style={[
                  styles.metricIconWrap,
                  { backgroundColor: `${theme.colors.warning}15` },
                ]}
              >
                <Icon
                  name="flame-outline"
                  size={16}
                  color={theme.colors.warning}
                />
              </View>
              <Text variant="headline" color="text">
                {today.caloriesBurned} <Text variant="caption" color="textMuted">kcal</Text>
              </Text>
              <Text variant="caption" color="textMuted">
                Calories
              </Text>
            </View>
          </View>
        </Card>

        {/* 24-Hour Movement Histogram */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text variant="title" color="text">
                Hourly Steps
              </Text>
              <Text variant="caption" color="textMuted">
                Today's step activity distribution
              </Text>
            </View>
            <Badge
              label={`${Math.round(stepRatio * 100)}% Goal`}
              variant={stepRatio >= 1 ? "success" : "neutral"}
              size="small"
            />
          </View>

          <View style={styles.hourlyChart}>
            {today.hourlySteps.map((steps, h) => {
              const heightPercent =
                steps === 0 ? 3 : Math.max(8, Math.round((steps / maxHourSteps) * 100));
              return (
                <View key={h} style={styles.hourBarCol}>
                  <View
                    style={[
                      styles.hourBarTrack,
                      { backgroundColor: theme.colors.surfaceAlt },
                    ]}
                  >
                    <View
                      style={[
                        styles.hourBarFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor:
                            steps > 800 ? theme.colors.accent : `${theme.colors.accent}66`,
                        },
                      ]}
                    />
                  </View>
                  {(h === 0 || h === 6 || h === 12 || h === 18 || h === 23) && (
                    <Text
                      variant="caption"
                      color="textSubtle"
                      style={styles.hourMarker}
                    >
                      {h}h
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </Card>

        {/* 7-Day Weekly Trend */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text variant="title" color="text">
                Weekly Trend
              </Text>
              <Text variant="caption" color="textMuted">
                Avg: {weeklyAvg.toLocaleString()} steps/day
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.ActivityHistory)}
              activeOpacity={0.7}
            >
              <Text variant="captionStrong" color="accent">
                History & Heatmap →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bar Chart */}
          <View style={styles.weeklyChart}>
            {weekly.map((day, idx) => {
              const heightPercent = Math.max(
                12,
                Math.round((day.steps / maxWeeklySteps) * 100)
              );
              const isToday = idx === weekly.length - 1;

              return (
                <View key={day.date} style={styles.weeklyBarCol}>
                  <Text variant="caption" color="textMuted" style={{ fontSize: 9 }}>
                    {(day.steps / 1000).toFixed(1)}k
                  </Text>
                  <View
                    style={[
                      styles.weeklyBarTrack,
                      { backgroundColor: theme.colors.surfaceAlt },
                    ]}
                  >
                    <View
                      style={[
                        styles.weeklyBarFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: day.goalAchieved
                            ? theme.colors.success
                            : isToday
                            ? theme.colors.accent
                            : `${theme.colors.accent}66`,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    variant="captionStrong"
                    style={{
                      fontSize: 11,
                      color: isToday ? theme.colors.text : theme.colors.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {day.dayLabel}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Recent Workouts */}
        {workouts.length > 0 && (
          <Card style={styles.sectionCard}>
            <Text variant="title" color="text" style={{ marginBottom: 12 }}>
              Today's Workouts
            </Text>

            <View style={styles.workoutsList}>
              {workouts.map((w) => (
                <View key={w.id} style={styles.workoutItem}>
                  <View
                    style={[
                      styles.workoutIconWrap,
                      { backgroundColor: `${theme.colors.accent}18` },
                    ]}
                  >
                    <Icon name={w.icon as any} size={20} color={theme.colors.accent} />
                  </View>

                  <View style={styles.workoutInfo}>
                    <Text variant="bodyStrong" color="text">
                      {w.title}
                    </Text>
                    <Text variant="caption" color="textMuted">
                      {w.startTime} • {w.durationMinutes} min
                      {w.distanceKm ? ` • ${w.distanceKm} km` : ""}
                    </Text>
                  </View>

                  <View style={styles.workoutStats}>
                    <Text variant="bodyStrong" color="text">
                      {w.calories} kcal
                    </Text>
                    {w.avgHeartRate && (
                      <Text variant="caption" color="textMuted">
                        ♥ {w.avgHeartRate} bpm
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Location Toggle Component (10.3) */}
        <LocationToggle />

        {/* Activity History CTA Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate(Routes.ActivityHistory)}
        >
          <Card
            style={[
              styles.historyCard,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.historyIcon,
                { backgroundColor: `${theme.colors.accent}20` },
              ]}
            >
              <Icon
                name="calendar-clear-outline"
                size={22}
                color={theme.colors.accent}
              />
            </View>
            <View style={styles.historyContent}>
              <Text variant="bodyStrong" color="text">
                Full Activity History & Heatmap
              </Text>
              <Text variant="caption" color="textMuted">
                View monthly calendar consistency & streaks
              </Text>
            </View>
            <Icon
              name="chevron-forward"
              size={18}
              color={theme.colors.textMuted}
            />
          </Card>
        </TouchableOpacity>
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
  heroCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  ringWrapper: {
    marginVertical: 8,
  },
  ringInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  stepsText: {
    marginVertical: 2,
    fontSize: 26,
    fontWeight: "700",
  },
  heroDivider: {
    marginVertical: 18,
    width: "100%",
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  hourlyChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 85,
    paddingTop: 6,
  },
  hourBarCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  hourBarTrack: {
    width: 6,
    height: 60,
    borderRadius: 3,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  hourBarFill: {
    width: "100%",
    borderRadius: 3,
  },
  hourMarker: {
    fontSize: 8,
    marginTop: 4,
    position: "absolute",
    bottom: -16,
  },
  weeklyChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingTop: 10,
  },
  weeklyBarCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  weeklyBarTrack: {
    width: 16,
    height: 75,
    borderRadius: 8,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  weeklyBarFill: {
    width: "100%",
    borderRadius: 8,
  },
  workoutsList: {
    gap: 12,
  },
  workoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  workoutIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutStats: {
    alignItems: "flex-end",
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
  },
  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  historyContent: {
    flex: 1,
  },
});
