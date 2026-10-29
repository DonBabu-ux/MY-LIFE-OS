/**
 * DayViewScreen — daily timeline of time-blocks + tasks.
 * Features: hour ruler, task blocks, date nav, add-task FAB.
 * Drag-to-reorder is UI-only (visual affordance, no actual reorder).
 * Batch 8.1
 */

import React, { useState, useMemo, useCallback, useRef } from "react";
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
  Text,
  Icon,
  Card,
  Button,
  EmptyState,
} from "../../../components";
import { Routes } from "../../../navigation/routes";
import { usePlannerStore } from "../state/plannerSlice";
import { PRIORITY_CONFIG } from "../mock";
import type { Task } from "../mock";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const HOUR_HEIGHT = 64; // px per hour
const START_HOUR = 6;   // display from 6am
const END_HOUR = 23;    // display to 11pm
const TOTAL_HOURS = END_HOUR - START_HOUR;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatHour = (h: number) => {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
};

const parseHour = (iso: string) => new Date(iso).getHours() + new Date(iso).getMinutes() / 60;

const topFromHour = (h: number) => Math.max(0, (h - START_HOUR) * HOUR_HEIGHT);

const heightFromDuration = (startIso: string, endIso: string) => {
  const durationHrs = (new Date(endIso).getTime() - new Date(startIso).getTime()) / 3600000;
  return Math.max(HOUR_HEIGHT * 0.5, durationHrs * HOUR_HEIGHT);
};

// ---------------------------------------------------------------------------
// Time-block Task Card
// ---------------------------------------------------------------------------
const TimeBlock: React.FC<{
  task: Task;
  onPress: () => void;
  onToggle: () => void;
}> = ({ task, onPress, onToggle }) => {
  const theme = useTheme();
  const cfg = PRIORITY_CONFIG[task.priority];

  if (!task.plannedStart || !task.plannedEnd) return null;

  const top = topFromHour(parseHour(task.plannedStart));
  const height = heightFromDuration(task.plannedStart, task.plannedEnd);
  const startLabel = new Date(task.plannedStart).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endLabel = new Date(task.plannedEnd).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.timeBlock,
        {
          top,
          height,
          backgroundColor: `${cfg.color}18`,
          borderLeftColor: cfg.color,
          opacity: task.isCompleted ? 0.5 : 1,
        },
      ]}
    >
      <View style={styles.blockHeader}>
        <TouchableOpacity onPress={onToggle} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <Icon
            name={task.isCompleted ? "checkmark-circle" : "ellipse-outline"}
            size={16}
            color={task.isCompleted ? cfg.color : theme.colors.textMuted}
          />
        </TouchableOpacity>
        <Text
          variant="captionStrong"
          style={[
            styles.blockTitle,
            { color: cfg.color },
            task.isCompleted && styles.strikethrough,
          ]}
          numberOfLines={height < 50 ? 1 : 2}
        >
          {task.title}
        </Text>
        {/* drag handle */}
        <Icon name="reorder-three-outline" size={14} color={theme.colors.textMuted} />
      </View>
      {height >= 52 && (
        <Text variant="caption" color="textMuted" style={styles.blockTime}>
          {startLabel} – {endLabel}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// All-day task row (no time block)
// ---------------------------------------------------------------------------
const AllDayTask: React.FC<{
  task: Task;
  onPress: () => void;
  onToggle: () => void;
}> = ({ task, onPress, onToggle }) => {
  const theme = useTheme();
  const cfg = PRIORITY_CONFIG[task.priority];
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.allDayRow,
        {
          borderLeftColor: cfg.color,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <TouchableOpacity onPress={onToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Icon
          name={task.isCompleted ? "checkmark-circle" : "ellipse-outline"}
          size={18}
          color={task.isCompleted ? cfg.color : theme.colors.textMuted}
        />
      </TouchableOpacity>
      <Text
        variant="body"
        style={[
          styles.allDayTitle,
          task.isCompleted && styles.strikethrough,
          { color: task.isCompleted ? theme.colors.textMuted : theme.colors.text },
        ]}
        numberOfLines={1}
      >
        {task.title}
      </Text>
      <Icon name={cfg.icon as any} size={14} color={cfg.color} />
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export const DayViewScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const tasks = usePlannerStore((s) => s.tasks);
  const toggleComplete = usePlannerStore((s) => s.toggleComplete);
  const getTasksForDate = usePlannerStore((s) => s.getTasksForDate);

  const [viewDate, setViewDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const dateStr = viewDate.toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const isToday = dateStr === today;

  const navigateDay = (dir: -1 | 1) => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() + dir);
    setViewDate(d);
  };

  const dayTasks = useMemo(() => {
    // Include all tasks for this date (including completed)
    return tasks.filter((t) => t.dueDate === dateStr);
  }, [tasks, dateStr]);

  const timedTasks = dayTasks.filter((t) => t.plannedStart && t.plannedEnd);
  const allDayTasks = dayTasks.filter((t) => !t.plannedStart);

  const completedCount = dayTasks.filter((t) => t.isCompleted).length;

  // Scroll to current time on mount
  const scrollToNow = useCallback(() => {
    if (!isToday) return;
    const nowHour = new Date().getHours() + new Date().getMinutes() / 60;
    const offset = Math.max(0, topFromHour(nowHour) - HOUR_HEIGHT * 1.5);
    scrollRef.current?.scrollTo({ y: offset, animated: true });
  }, [isToday]);

  return (
    <Screen style={styles.root}>
      <Header
        title="Day View"
        subtitle={`${completedCount}/${dayTasks.length} done`}
        right={
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.Upcoming)}
            style={styles.headerBtn}
          >
            <Icon name="list-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />

      {/* Date Navigator */}
      <View style={[styles.dateNav, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigateDay(-1)} style={styles.navBtn}>
          <Icon name="chevron-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewDate(new Date())}
          style={styles.dateCenter}
        >
          <Text variant="h3">
            {viewDate.toLocaleDateString(undefined, { weekday: "long" })}
          </Text>
          <View style={styles.dateSubRow}>
            <Text variant="caption" color="textMuted">
              {viewDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </Text>
            {isToday && (
              <View style={[styles.todayPill, { backgroundColor: theme.colors.accent }]}>
                <Text style={styles.todayPillText}>TODAY</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateDay(1)} style={styles.navBtn}>
          <Icon name="chevron-forward" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* All-day tasks */}
      {allDayTasks.length > 0 && (
        <View style={[styles.allDaySection, { borderBottomColor: theme.colors.border }]}>
          <Text variant="caption" color="textMuted" style={styles.allDayLabel}>ALL DAY</Text>
          {allDayTasks.map((task) => (
            <AllDayTask
              key={task.id}
              task={task}
              onPress={() => navigation.navigate(Routes.TaskDetail, { id: task.id })}
              onToggle={() => toggleComplete(task.id)}
            />
          ))}
        </View>
      )}

      {/* Timeline */}
      <ScrollView
        ref={scrollRef}
        style={styles.timeline}
        showsVerticalScrollIndicator={false}
        onLayout={scrollToNow}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
      >
        <View style={styles.timelineInner}>
          {/* Hour lines */}
          {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
            const hour = START_HOUR + i;
            return (
              <View key={hour} style={[styles.hourRow, { top: i * HOUR_HEIGHT }]}>
                <Text variant="caption" color="textMuted" style={styles.hourLabel}>
                  {formatHour(hour)}
                </Text>
                <View style={[styles.hourLine, { backgroundColor: theme.colors.border }]} />
              </View>
            );
          })}

          {/* Current time indicator */}
          {isToday && (() => {
            const nowH = new Date().getHours() + new Date().getMinutes() / 60;
            if (nowH < START_HOUR || nowH > END_HOUR) return null;
            return (
              <View style={[styles.nowLine, { top: topFromHour(nowH), backgroundColor: theme.colors.accent }]}>
                <View style={[styles.nowDot, { backgroundColor: theme.colors.accent }]} />
              </View>
            );
          })()}

          {/* Task time blocks */}
          <View style={styles.blocksLayer}>
            {timedTasks.map((task) => (
              <TimeBlock
                key={task.id}
                task={task}
                onPress={() => navigation.navigate(Routes.TaskDetail, { id: task.id })}
                onToggle={() => toggleComplete(task.id)}
              />
            ))}
          </View>

          {/* Empty state overlay */}
          {dayTasks.length === 0 && (
            <View style={styles.emptyOverlay}>
              <EmptyState
                icon={<Icon name="calendar-outline" size={40} color={theme.colors.textMuted} />}
                title="Nothing Planned"
                description="Tap + to add a task for this day."
                action={
                  <Button
                    label="Add Task"
                    variant="primary"
                    onPress={() => navigation.navigate(Routes.TaskDetail, { id: "__new__" })}
                  />
                }
              />
            </View>
          )}

          {/* Bottom spacer */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate(Routes.TaskDetail, { id: "__new__" })}
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
      >
        <Icon name="add" size={28} color={theme.colors.onAccent} />
      </TouchableOpacity>
    </Screen>
  );
};

const RULER_WIDTH = 52;

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dateNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCenter: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  dateSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  todayPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  todayPillText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  allDaySection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  allDayLabel: {
    letterSpacing: 0.5,
    fontSize: 10,
    marginBottom: 2,
  },
  allDayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 3,
  },
  allDayTitle: {
    flex: 1,
    fontSize: 14,
  },
  timeline: {
    flex: 1,
  },
  timelineInner: {
    position: "relative",
    marginLeft: RULER_WIDTH,
    height: TOTAL_HOURS * HOUR_HEIGHT + 60,
  },
  hourRow: {
    position: "absolute",
    left: -RULER_WIDTH,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  hourLabel: {
    width: RULER_WIDTH - 8,
    textAlign: "right",
    fontSize: 11,
    paddingRight: 8,
  },
  hourLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  nowLine: {
    position: "absolute",
    left: 0,
    right: 16,
    height: 1.5,
    borderRadius: 1,
    zIndex: 10,
  },
  nowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    left: -5,
    top: -4,
  },
  blocksLayer: {
    position: "absolute",
    top: 0,
    left: 4,
    right: 16,
    bottom: 0,
  },
  timeBlock: {
    position: "absolute",
    left: 0,
    right: 0,
    borderRadius: 10,
    borderLeftWidth: 3,
    paddingHorizontal: 8,
    paddingVertical: 6,
    overflow: "hidden",
    gap: 3,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  blockTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  blockTime: {
    fontSize: 11,
    paddingLeft: 22,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  emptyOverlay: {
    position: "absolute",
    top: HOUR_HEIGHT * 3,
    left: 16,
    right: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default DayViewScreen;
