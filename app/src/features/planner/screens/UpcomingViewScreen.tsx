/**
 * UpcomingViewScreen — Overdue / Today / Next 7 days / Completed sections.
 * Batch 8.3
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  SectionList,
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
  Button,
  EmptyState,
  Divider,
  Badge,
} from "../../../components";
import { Routes } from "../../../navigation/routes";
import { usePlannerStore } from "../state/plannerSlice";
import { PRIORITY_CONFIG, RECURRENCE_LABELS } from "../mock";
import type { Task } from "../mock";

// ---------------------------------------------------------------------------
// Task Row
// ---------------------------------------------------------------------------
const TaskRow: React.FC<{
  task: Task;
  onPress: () => void;
  onToggle: () => void;
  isLast: boolean;
}> = ({ task, onPress, onToggle, isLast }) => {
  const theme = useTheme();
  const cfg = PRIORITY_CONFIG[task.priority];

  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = !task.isCompleted && task.dueDate && task.dueDate < today;

  const dueDateLabel = task.dueDate
    ? (() => {
        const d = new Date(task.dueDate + "T00:00:00");
        const diff = Math.ceil(
          (d.getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000
        );
        if (diff === 0) return "Today";
        if (diff === 1) return "Tomorrow";
        if (diff === -1) return "Yesterday";
        if (diff < 0) return `${Math.abs(diff)}d overdue`;
        return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      })()
    : null;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={[styles.taskRow, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border }]}>
        {/* Priority bar */}
        <View style={[styles.priorityBar, { backgroundColor: cfg.color }]} />

        {/* Complete toggle */}
        <TouchableOpacity
          onPress={onToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View
            style={[
              styles.checkCircle,
              {
                borderColor: task.isCompleted ? cfg.color : theme.colors.border,
                backgroundColor: task.isCompleted ? `${cfg.color}22` : "transparent",
              },
            ]}
          >
            {task.isCompleted && (
              <Icon name="checkmark" size={12} color={cfg.color} />
            )}
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.taskContent}>
          <Text
            variant="body"
            style={[
              styles.taskTitle,
              task.isCompleted && { textDecorationLine: "line-through", color: theme.colors.textMuted },
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          <View style={styles.taskMeta}>
            {dueDateLabel && (
              <View style={styles.metaItem}>
                <Icon
                  name="calendar-outline"
                  size={11}
                  color={isOverdue ? theme.colors.danger : theme.colors.textMuted}
                />
                <Text
                  variant="caption"
                  style={{ color: isOverdue ? theme.colors.danger : theme.colors.textMuted, fontSize: 11 }}
                >
                  {dueDateLabel}
                </Text>
              </View>
            )}
            {task.recurrence !== "none" && (
              <View style={styles.metaItem}>
                <Icon name="repeat-outline" size={11} color={theme.colors.textMuted} />
                <Text variant="caption" color="textMuted" style={{ fontSize: 11 }}>
                  {RECURRENCE_LABELS[task.recurrence]}
                </Text>
              </View>
            )}
            {task.reminders.length > 0 && (
              <View style={styles.metaItem}>
                <Icon name="notifications-outline" size={11} color={theme.colors.textMuted} />
              </View>
            )}
          </View>
        </View>

        {/* Priority badge + chevron */}
        <View style={styles.taskRight}>
          <Icon name={cfg.icon as any} size={14} color={cfg.color} />
          <Icon name="chevron-forward" size={14} color={theme.colors.border} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Section Header
// ---------------------------------------------------------------------------
const SectionHdr: React.FC<{
  title: string;
  count: number;
  tone?: "danger" | "warning" | "muted";
  collapsed: boolean;
  onToggle: () => void;
}> = ({ title, count, tone = "muted", collapsed, onToggle }) => {
  const theme = useTheme();
  const color =
    tone === "danger"
      ? theme.colors.danger
      : tone === "warning"
      ? theme.colors.warning
      : theme.colors.textMuted;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={styles.sectionHdr}>
      <View style={[styles.sectionDot, { backgroundColor: color }]} />
      <Text variant="captionStrong" style={[styles.sectionTitle, { color }]}>
        {title.toUpperCase()}
      </Text>
      <View style={[styles.countBadge, { backgroundColor: `${color}22` }]}>
        <Text variant="caption" style={{ color, fontSize: 11, fontWeight: "700" }}>
          {count}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <Icon
        name={collapsed ? "chevron-down" : "chevron-up"}
        size={16}
        color={theme.colors.textMuted}
      />
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export const UpcomingViewScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const overdueTasks = usePlannerStore((s) => s.getOverdueTasks());
  const todayTasks = usePlannerStore((s) => s.getTodayTasks());
  const upcomingTasks = usePlannerStore((s) => s.getUpcomingTasks(7));
  const completedTasks = usePlannerStore((s) => s.getCompletedTasks());
  const toggleComplete = usePlannerStore((s) => s.toggleComplete);

  const [refreshing, setRefreshing] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    completed: true,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const toggleSection = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  type Section = {
    key: string;
    title: string;
    count: number;
    tone: "danger" | "warning" | "muted";
    data: Task[];
  };

  const sections: Section[] = useMemo(() => {
    const result: Section[] = [];
    if (overdueTasks.length > 0)
      result.push({ key: "overdue", title: "Overdue", count: overdueTasks.length, tone: "danger", data: collapsed["overdue"] ? [] : overdueTasks });
    result.push({ key: "today", title: "Today", count: todayTasks.length, tone: "warning", data: collapsed["today"] ? [] : todayTasks });
    if (upcomingTasks.length > 0)
      result.push({ key: "upcoming", title: "Next 7 Days", count: upcomingTasks.length, tone: "muted", data: collapsed["upcoming"] ? [] : upcomingTasks });
    if (completedTasks.length > 0)
      result.push({ key: "completed", title: "Completed", count: completedTasks.length, tone: "muted", data: collapsed["completed"] ? [] : completedTasks.slice(0, 20) });
    return result;
  }, [overdueTasks, todayTasks, upcomingTasks, completedTasks, collapsed]);

  const totalActive = overdueTasks.length + todayTasks.filter((t) => !t.isCompleted).length + upcomingTasks.length;

  return (
    <Screen style={styles.root}>
      <Header
        title="Upcoming"
        subtitle={`${totalActive} active task${totalActive !== 1 ? "s" : ""}`}
        right={
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.DayView)}
            style={styles.headerBtn}
          >
            <Icon name="today-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
        renderSectionHeader={({ section }) => (
          <SectionHdr
            title={section.title}
            count={section.count}
            tone={section.tone as any}
            collapsed={!!collapsed[section.key]}
            onToggle={() => toggleSection(section.key)}
          />
        )}
        renderItem={({ item, index, section }) => (
          <Card padding="none" style={styles.sectionCard}>
            <TaskRow
              task={item}
              onPress={() => navigation.navigate(Routes.TaskDetail, { id: item.id })}
              onToggle={() => toggleComplete(item.id)}
              isLast={index === section.data.length - 1}
            />
          </Card>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={<Icon name="checkmark-done-outline" size={48} color={theme.colors.textMuted} />}
            title="All Clear!"
            description="No tasks yet. Add your first task and get things done."
            action={
              <Button
                label="Add Task"
                variant="primary"
                onPress={() => navigation.navigate(Routes.TaskDetail, { id: "__new__" })}
              />
            }
          />
        }
        SectionSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

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

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 4,
  },
  sectionHdr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    letterSpacing: 0.6,
    fontSize: 11,
  },
  countBadge: {
    minWidth: 22,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 2,
    overflow: "hidden",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  priorityBar: {
    width: 3,
    height: 36,
    borderRadius: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  taskContent: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  taskRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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

export default UpcomingViewScreen;
