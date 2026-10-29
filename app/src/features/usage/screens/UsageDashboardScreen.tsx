/**
 * UsageDashboardScreen — Screen Time & Digital Wellbeing Overview.
 * Features:
 *  - Today's total screen time & comparison vs yesterday
 *  - Pickups & notification counters
 *  - Weekly trend sparkline / bar chart with daily avg
 *  - Category breakdown distribution
 *  - Top 5 apps bar list with navigation to AppDetailScreen
 *  - Quick access to Focus Rules
 * Batch 9.1
 */

import React, { useState, useMemo } from "react";
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
  Sparkline,
  Divider,
} from "../../../components";
import { useUsageStore } from "../state/usageSlice";
import { formatDuration, APP_CATEGORIES, type AppUsageItem } from "../mock";
import { Routes } from "../../../navigation/routes";

export const UsageDashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);

  const apps = useUsageStore((s) => s.apps);
  const focusRules = useUsageStore((s) => s.focusRules);
  const pickupsToday = useUsageStore((s) => s.pickupsToday);
  const notificationsToday = useUsageStore((s) => s.notificationsToday);
  const getTodayTotalMinutes = useUsageStore((s) => s.getTodayTotalMinutes);
  const getYesterdayTotalMinutes = useUsageStore((s) => s.getYesterdayTotalMinutes);
  const getWeeklyTrend = useUsageStore((s) => s.getWeeklyTrend);
  const getCategoryBreakdown = useUsageStore((s) => s.getCategoryBreakdown);

  const todayMinutes = getTodayTotalMinutes();
  const yesterdayMinutes = getYesterdayTotalMinutes();
  const weeklyTrend = getWeeklyTrend();
  const categoryStats = getCategoryBreakdown();

  const sortedApps = useMemo(() => {
    return [...apps].sort((a, b) => b.todayMinutes - a.todayMinutes);
  }, [apps]);

  const displayedApps = showAllApps ? sortedApps : sortedApps.slice(0, 5);
  const maxAppMinutes = sortedApps[0]?.todayMinutes || 1;

  // Comparison vs yesterday
  const diffPercent = yesterdayMinutes
    ? Math.round(((todayMinutes - yesterdayMinutes) / yesterdayMinutes) * 100)
    : 0;
  const isLower = diffPercent <= 0;

  // Weekly daily average
  const weeklyAvg = Math.round(
    weeklyTrend.reduce((sum, v) => sum + v, 0) / (weeklyTrend.length || 1)
  );

  const activeRulesCount = focusRules.filter((r) => r.isEnabled).length;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxWeekDay = Math.max(...weeklyTrend, 1);

  return (
    <Screen style={styles.screen}>
      <Header
        title="Screen Time"
        subtitle="Digital Wellbeing"
        rightAction={{
          icon: "shield-checkmark-outline",
          onPress: () => navigation.navigate(Routes.FocusRules),
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
        {/* Hero Today Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text variant="captionStrong" color="textMuted">
                TODAY'S USAGE
              </Text>
              <Text variant="display" color="text" style={styles.heroTime}>
                {formatDuration(todayMinutes)}
              </Text>
            </View>

            <View
              style={[
                styles.trendBadge,
                {
                  backgroundColor: isLower
                    ? `${theme.colors.success}18`
                    : `${theme.colors.warning}18`,
                },
              ]}
            >
              <Icon
                name={isLower ? "trending-down" : "trending-up"}
                size={16}
                color={isLower ? theme.colors.success : theme.colors.warning}
              />
              <Text
                variant="captionStrong"
                style={{
                  color: isLower ? theme.colors.success : theme.colors.warning,
                  marginLeft: 4,
                }}
              >
                {Math.abs(diffPercent)}% {isLower ? "less" : "more"}
              </Text>
            </View>
          </View>

          <Text variant="caption" color="textMuted" style={styles.heroCompare}>
            vs {formatDuration(yesterdayMinutes)} yesterday
          </Text>

          <Divider style={styles.heroDivider} />

          {/* Stat Tiles: Pickups & Notifications */}
          <View style={styles.statsRow}>
            <View style={styles.statTile}>
              <View
                style={[
                  styles.statIconCircle,
                  { backgroundColor: `${theme.colors.accent}15` },
                ]}
              >
                <Icon
                  name="phone-portrait-outline"
                  size={18}
                  color={theme.colors.accent}
                />
              </View>
              <View>
                <Text variant="headline" color="text">
                  {pickupsToday}
                </Text>
                <Text variant="caption" color="textMuted">
                  Pickups today
                </Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statTile}>
              <View
                style={[
                  styles.statIconCircle,
                  { backgroundColor: `${theme.colors.warning}15` },
                ]}
              >
                <Icon
                  name="notifications-outline"
                  size={18}
                  color={theme.colors.warning}
                />
              </View>
              <View>
                <Text variant="headline" color="text">
                  {notificationsToday}
                </Text>
                <Text variant="caption" color="textMuted">
                  Notifications
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Weekly Trend Section */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text variant="title" color="text">
                Weekly Trend
              </Text>
              <Text variant="caption" color="textMuted">
                Daily average: {formatDuration(weeklyAvg)}
              </Text>
            </View>
            <Sparkline
              data={weeklyTrend}
              width={100}
              height={36}
              color={theme.colors.accent}
              strokeWidth={2.5}
            />
          </View>

          {/* 7-Day Bar Chart */}
          <View style={styles.weekChart}>
            {weeklyTrend.map((minutes, idx) => {
              const heightPercent = Math.max(12, Math.round((minutes / maxWeekDay) * 100));
              const isToday = idx === 3; // Thursday in our mock
              return (
                <View key={idx} style={styles.barCol}>
                  <Text variant="caption" color="textMuted" style={styles.barValueText}>
                    {Math.round(minutes / 60)}h
                  </Text>
                  <View
                    style={[
                      styles.barTrack,
                      { backgroundColor: theme.colors.surfaceAlt },
                    ]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: isToday
                            ? theme.colors.accent
                            : `${theme.colors.accent}66`,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    variant="captionStrong"
                    style={{
                      fontSize: 10,
                      color: isToday ? theme.colors.accent : theme.colors.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {dayLabels[idx]}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Category Breakdown */}
        <Card style={styles.sectionCard}>
          <Text variant="title" color="text" style={{ marginBottom: 12 }}>
            Category Distribution
          </Text>

          {/* Segmented Bar */}
          <View style={styles.stackedBarContainer}>
            {categoryStats.map((cat) => (
              <View
                key={cat.category}
                style={{
                  flex: cat.percentage,
                  height: 12,
                  backgroundColor: cat.color,
                }}
              />
            ))}
          </View>

          {/* Category Legend */}
          <View style={styles.categoryGrid}>
            {categoryStats.map((cat) => (
              <View key={cat.category} style={styles.categoryChip}>
                <View
                  style={[styles.colorDot, { backgroundColor: cat.color }]}
                />
                <Text variant="caption" color="text" numberOfLines={1}>
                  {cat.label}
                </Text>
                <Text
                  variant="captionStrong"
                  color="textMuted"
                  style={{ marginLeft: "auto" }}
                >
                  {cat.percentage}%
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Top Apps Bar List */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text variant="title" color="text">
              Most Used Apps
            </Text>
            <Badge
              label={`${displayedApps.length} Apps`}
              variant="outline"
              size="small"
            />
          </View>

          <View style={styles.appsList}>
            {displayedApps.map((app, index) => {
              const catCfg = APP_CATEGORIES[app.category];
              const barWidthPercent = Math.max(
                6,
                Math.round((app.todayMinutes / maxAppMinutes) * 100)
              );

              return (
                <TouchableOpacity
                  key={app.id}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate(Routes.AppDetail, { appId: app.id })
                  }
                  style={styles.appRow}
                >
                  <View style={styles.appRowTop}>
                    {/* App Icon */}
                    <View
                      style={[
                        styles.appIconContainer,
                        { backgroundColor: `${app.color}22` },
                      ]}
                    >
                      <Icon
                        name={app.icon as any}
                        size={18}
                        color={app.color}
                      />
                    </View>

                    {/* App Name and Category */}
                    <View style={styles.appInfo}>
                      <Text variant="bodyStrong" color="text">
                        {app.name}
                      </Text>
                      <View style={styles.catBadgeRow}>
                        <View
                          style={[
                            styles.catDot,
                            { backgroundColor: catCfg.color },
                          ]}
                        />
                        <Text variant="caption" color="textMuted">
                          {catCfg.label}
                        </Text>
                      </View>
                    </View>

                    {/* App Duration & Chevron */}
                    <View style={styles.appUsageRight}>
                      <Text variant="bodyStrong" color="text">
                        {formatDuration(app.todayMinutes)}
                      </Text>
                      <Icon
                        name="chevron-forward"
                        size={16}
                        color={theme.colors.textSubtle}
                      />
                    </View>
                  </View>

                  {/* Horizontal Bar Chart */}
                  <View
                    style={[
                      styles.appBarTrack,
                      { backgroundColor: theme.colors.surfaceAlt },
                    ]}
                  >
                    <View
                      style={[
                        styles.appBarFill,
                        {
                          width: `${barWidthPercent}%`,
                          backgroundColor: app.color,
                        },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Toggle View All Apps */}
          {sortedApps.length > 5 && (
            <TouchableOpacity
              onPress={() => setShowAllApps(!showAllApps)}
              style={styles.toggleAllBtn}
              activeOpacity={0.7}
            >
              <Text variant="captionStrong" color="accent">
                {showAllApps ? "Show Top 5" : `View All (${sortedApps.length})`}
              </Text>
              <Icon
                name={showAllApps ? "chevron-up" : "chevron-down"}
                size={14}
                color={theme.colors.accent}
              />
            </TouchableOpacity>
          )}
        </Card>

        {/* Focus Rules Quick Action */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate(Routes.FocusRules)}
        >
          <Card
            style={[
              styles.focusCard,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.focusIcon,
                { backgroundColor: `${theme.colors.accent}20` },
              ]}
            >
              <Icon
                name="hourglass-outline"
                size={22}
                color={theme.colors.accent}
              />
            </View>
            <View style={styles.focusContent}>
              <Text variant="bodyStrong" color="text">
                App Limits & Focus Rules
              </Text>
              <Text variant="caption" color="textMuted">
                {activeRulesCount} active limit{activeRulesCount === 1 ? "" : "s"} enforced today
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
    padding: 18,
    borderRadius: 16,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroTime: {
    marginTop: 4,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  heroCompare: {
    marginTop: 4,
  },
  heroDivider: {
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statTile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginHorizontal: 12,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  weekChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingTop: 10,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barValueText: {
    fontSize: 9,
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 75,
    borderRadius: 7,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 7,
  },
  stackedBarContainer: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 14,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  appsList: {
    gap: 16,
  },
  appRow: {
    gap: 8,
  },
  appRowTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  appIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  appInfo: {
    flex: 1,
  },
  catBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  appUsageRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appBarTrack: {
    height: 5,
    borderRadius: 2.5,
    overflow: "hidden",
    marginLeft: 48,
  },
  appBarFill: {
    height: "100%",
    borderRadius: 2.5,
  },
  toggleAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 14,
    paddingTop: 8,
  },
  focusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
  },
  focusIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  focusContent: {
    flex: 1,
  },
});
