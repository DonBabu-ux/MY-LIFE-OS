/**
 * AppDetailScreen — Per-app usage analytics & configuration.
 * Features:
 *  - Screen time today & comparison vs yesterday
 *  - Launch count & notification count
 *  - 24-hour hourly distribution chart
 *  - 7-day weekly history chart
 *  - Category assignment with AppCategoryPicker
 *  - App Limit / Focus Rule status & quick setup
 * Batch 9.2
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Icon,
  Badge,
  Button,
  Divider,
} from "../../../components";
import { useUsageStore } from "../state/usageSlice";
import { AppCategoryPicker } from "../components/AppCategoryPicker";
import { AddFocusRuleSheet } from "../components/AddFocusRuleSheet";
import {
  formatDuration,
  APP_CATEGORIES,
  type AppCategory,
} from "../mock";
import type { MoreStackParamList } from "../../../navigation/types";

type AppDetailRoute = RouteProp<MoreStackParamList, "AppDetail">;

export const AppDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<AppDetailRoute>();
  const appId = route.params?.appId;

  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [ruleSheetVisible, setRuleSheetVisible] = useState(false);

  const getAppById = useUsageStore((s) => s.getAppById);
  const updateAppCategory = useUsageStore((s) => s.updateAppCategory);
  const getFocusRuleByAppId = useUsageStore((s) => s.getFocusRuleByAppId);
  const toggleFocusRule = useUsageStore((s) => s.toggleFocusRule);

  const app = getAppById(appId);
  const focusRule = getFocusRuleByAppId(appId);

  if (!app) {
    return (
      <Screen style={styles.screen}>
        <Header title="App Details" showBack />
        <View style={styles.notFound}>
          <Text variant="body" color="textMuted">
            App not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 12 }}
          />
        </View>
      </Screen>
    );
  }

  const catCfg = APP_CATEGORIES[app.category];

  // Hourly stats
  const maxHourMinute = Math.max(...app.hourlyMinutes, 1);
  const peakHourIdx = app.hourlyMinutes.indexOf(Math.max(...app.hourlyMinutes));
  const peakHourStr = `${peakHourIdx}:00 - ${peakHourIdx + 1}:00`;

  // Weekly stats
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxWeeklyMinute = Math.max(...app.weeklyMinutes, 1);
  const weeklyAvg = Math.round(
    app.weeklyMinutes.reduce((a, b) => a + b, 0) / (app.weeklyMinutes.length || 1)
  );

  // Time diff vs yesterday
  const diffMinutes = app.todayMinutes - app.yesterdayMinutes;
  const isLower = diffMinutes <= 0;

  // Limit status
  const isOverLimit =
    focusRule && focusRule.isEnabled && app.todayMinutes > focusRule.allowedMinutes;
  const remainingMinutes =
    focusRule && focusRule.isEnabled
      ? Math.max(0, focusRule.allowedMinutes - app.todayMinutes)
      : 0;

  const handleCategoryChange = (newCat: AppCategory) => {
    updateAppCategory(app.id, newCat);
  };

  return (
    <Screen style={styles.screen}>
      <Header
        title={app.name}
        showBack
        rightAction={{
          icon: "time-outline",
          onPress: () => setRuleSheetVisible(true),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* App Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            {/* App Icon Circle */}
            <View
              style={[
                styles.appIconContainer,
                { backgroundColor: `${app.color}22` },
              ]}
            >
              <Icon name={app.icon as any} size={32} color={app.color} />
            </View>

            <View style={styles.heroTitleCol}>
              <Text variant="title" color="text">
                {app.name}
              </Text>

              {/* Category Pill with Edit Affordance */}
              <TouchableOpacity
                onPress={() => setCategoryPickerVisible(true)}
                activeOpacity={0.7}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: `${catCfg.color}18`,
                    borderColor: catCfg.color,
                  },
                ]}
              >
                <View
                  style={[styles.catDot, { backgroundColor: catCfg.color }]}
                />
                <Text
                  variant="captionStrong"
                  style={{ color: catCfg.color, fontSize: 11 }}
                >
                  {catCfg.label}
                </Text>
                <Icon name="chevron-down" size={12} color={catCfg.color} />
              </TouchableOpacity>
            </View>

            {/* Total Today Display */}
            <View style={styles.heroUsageRight}>
              <Text variant="display" color="text">
                {formatDuration(app.todayMinutes)}
              </Text>
              <Text variant="caption" color="textMuted">
                today
              </Text>
            </View>
          </View>

          {/* Yesterday Comparison Banner */}
          <View style={styles.compareBanner}>
            <Icon
              name={isLower ? "trending-down" : "trending-up"}
              size={14}
              color={isLower ? theme.colors.success : theme.colors.warning}
            />
            <Text
              variant="captionStrong"
              style={{
                color: isLower ? theme.colors.success : theme.colors.warning,
                marginLeft: 4,
              }}
            >
              {Math.abs(diffMinutes)}m {isLower ? "less" : "more"} than yesterday ({formatDuration(app.yesterdayMinutes)})
            </Text>
          </View>

          <Divider style={styles.heroDivider} />

          {/* Launch & Notification Counters */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <View
                style={[
                  styles.metricIconWrap,
                  { backgroundColor: `${theme.colors.accent}15` },
                ]}
              >
                <Icon
                  name="open-outline"
                  size={16}
                  color={theme.colors.accent}
                />
              </View>
              <View>
                <Text variant="headline" color="text">
                  {app.launchCountToday}
                </Text>
                <Text variant="caption" color="textMuted">
                  Launches today
                </Text>
              </View>
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
                  name="notifications-outline"
                  size={16}
                  color={theme.colors.warning}
                />
              </View>
              <View>
                <Text variant="headline" color="text">
                  {app.notificationCountToday}
                </Text>
                <Text variant="caption" color="textMuted">
                  Notifications
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* 24-Hour Hourly Usage Distribution */}
        <Card style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text variant="title" color="text">
                Hourly Distribution
              </Text>
              <Text variant="caption" color="textMuted">
                Peak usage: {peakHourStr}
              </Text>
            </View>
          </View>

          {/* 24 Vertical Bars */}
          <View style={styles.hourlyChart}>
            {app.hourlyMinutes.map((mins, h) => {
              const heightPercent =
                mins === 0
                  ? 4
                  : Math.max(10, Math.round((mins / maxHourMinute) * 100));
              const isPeak = h === peakHourIdx && mins > 0;

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
                          backgroundColor: isPeak
                            ? theme.colors.accent
                            : mins > 0
                            ? app.color
                            : "transparent",
                        },
                      ]}
                    />
                  </View>
                  {/* Show hour labels at intervals: 0, 6, 12, 18, 23 */}
                  {(h === 0 || h === 6 || h === 12 || h === 18 || h === 23) && (
                    <Text
                      variant="caption"
                      color="textSubtle"
                      style={styles.hourLabelText}
                    >
                      {h}h
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </Card>

        {/* 7-Day Weekly History */}
        <Card style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text variant="title" color="text">
                Last 7 Days
              </Text>
              <Text variant="caption" color="textMuted">
                Daily average: {formatDuration(weeklyAvg)}
              </Text>
            </View>
          </View>

          <View style={styles.weeklyChart}>
            {app.weeklyMinutes.map((mins, idx) => {
              const heightPercent = Math.max(
                10,
                Math.round((mins / maxWeeklyMinute) * 100)
              );
              const isToday = idx === 3;
              return (
                <View key={idx} style={styles.weeklyBarCol}>
                  <Text variant="caption" color="textMuted" style={{ fontSize: 9 }}>
                    {formatDuration(mins)}
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
                          backgroundColor: isToday
                            ? app.color
                            : `${app.color}77`,
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
                    {dayLabels[idx]}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* App Limit / Focus Rule Section */}
        <Card style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text variant="title" color="text">
                App Limit & Rules
              </Text>
              <Text variant="caption" color="textMuted">
                Keep your digital habits intentional
              </Text>
            </View>
            {focusRule && (
              <TouchableOpacity
                onPress={() => toggleFocusRule(focusRule.id)}
                activeOpacity={0.7}
              >
                <Badge
                  label={focusRule.isEnabled ? "Active" : "Paused"}
                  variant={focusRule.isEnabled ? "success" : "neutral"}
                  size="small"
                />
              </TouchableOpacity>
            )}
          </View>

          {focusRule ? (
            <View style={styles.ruleStatusBox}>
              <View style={styles.ruleRow}>
                <View style={styles.ruleInfo}>
                  <Text variant="bodyStrong" color="text">
                    {formatDuration(focusRule.allowedMinutes)} daily limit
                  </Text>
                  <Text variant="caption" color="textMuted">
                    Active {focusRule.activeHours.start} - {focusRule.activeHours.end} ({focusRule.days.length} days/week)
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setRuleSheetVisible(true)}
                  style={styles.ruleEditBtn}
                >
                  <Icon name="pencil" size={16} color={theme.colors.accent} />
                </TouchableOpacity>
              </View>

              {/* Progress bar vs limit */}
              <View style={styles.limitBarWrap}>
                <View
                  style={[
                    styles.limitBarTrack,
                    { backgroundColor: theme.colors.surfaceAlt },
                  ]}
                >
                  <View
                    style={[
                      styles.limitBarFill,
                      {
                        width: `${Math.min(
                          100,
                          Math.round(
                            (app.todayMinutes / focusRule.allowedMinutes) * 100
                          )
                        )}%`,
                        backgroundColor: isOverLimit
                          ? theme.colors.error
                          : theme.colors.accent,
                      },
                    ]}
                  />
                </View>
                <View style={styles.limitStatusRow}>
                  <Text
                    variant="captionStrong"
                    style={{
                      color: isOverLimit
                        ? theme.colors.error
                        : theme.colors.textMuted,
                    }}
                  >
                    {isOverLimit
                      ? `Exceeded by ${formatDuration(app.todayMinutes - focusRule.allowedMinutes)}`
                      : `${formatDuration(remainingMinutes)} remaining today`}
                  </Text>
                  <Text variant="caption" color="textMuted">
                    {Math.round((app.todayMinutes / focusRule.allowedMinutes) * 100)}%
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noRuleBox}>
              <Text variant="body" color="textMuted">
                No usage limit configured for {app.name}.
              </Text>
              <Button
                title="+ Set App Limit"
                variant="secondary"
                size="small"
                onPress={() => setRuleSheetVisible(true)}
                style={{ marginTop: 10 }}
              />
            </View>
          )}
        </Card>
      </ScrollView>

      {/* Category Picker Sheet */}
      <AppCategoryPicker
        visible={categoryPickerVisible}
        value={app.category}
        onClose={() => setCategoryPickerVisible(false)}
        onChange={handleCategoryChange}
      />

      {/* Focus Rule Configuration Sheet */}
      <AddFocusRuleSheet
        visible={ruleSheetVisible}
        onClose={() => setRuleSheetVisible(false)}
        initialAppId={app.id}
        editRule={focusRule}
      />
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
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  heroCard: {
    padding: 18,
    borderRadius: 16,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  appIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  heroTitleCol: {
    flex: 1,
    gap: 4,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroUsageRight: {
    alignItems: "flex-end",
  },
  compareBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  heroDivider: {
    marginVertical: 16,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metricIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginHorizontal: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  hourlyChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
    paddingTop: 8,
  },
  hourBarCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  hourBarTrack: {
    width: 6,
    height: 70,
    borderRadius: 3,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  hourBarFill: {
    width: "100%",
    borderRadius: 3,
  },
  hourLabelText: {
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
  ruleStatusBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(150, 150, 150, 0.06)",
    gap: 12,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ruleInfo: {
    flex: 1,
  },
  ruleEditBtn: {
    padding: 6,
  },
  limitBarWrap: {
    gap: 6,
  },
  limitBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  limitBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  limitStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noRuleBox: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(150, 150, 150, 0.06)",
    alignItems: "center",
  },
});
