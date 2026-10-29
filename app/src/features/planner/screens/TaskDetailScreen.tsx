/**
 * TaskDetailScreen — Create / Edit a task.
 * Fields: title, notes, priority, due date, planned start/end,
 *         recurrence, reminders, complete toggle, delete.
 * Batch 8.2
 */

import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Icon,
  Button,
  Divider,
  Badge,
} from "../../../components";
import { usePlannerStore } from "../state/plannerSlice";
import { RecurrencePicker } from "../components/RecurrencePicker";
import { ReminderPicker } from "../components/ReminderPicker";
import {
  PRIORITY_CONFIG,
  RECURRENCE_LABELS,
  REMINDER_OPTIONS,
  type Priority,
  type RecurrencePreset,
  type Reminder,
} from "../mock";
import type { PlanStackParamList } from "../../../navigation/types";

type DetailRoute = RouteProp<PlanStackParamList, "TaskDetail">;

// ---------------------------------------------------------------------------
// Priority Selector Row
// ---------------------------------------------------------------------------
const PrioritySelector: React.FC<{
  value: Priority;
  onChange: (p: Priority) => void;
}> = ({ value, onChange }) => {
  const theme = useTheme();
  const priorities: Priority[] = ["low", "medium", "high", "critical"];
  return (
    <View style={styles.priorityRow}>
      {priorities.map((p) => {
        const cfg = PRIORITY_CONFIG[p];
        const selected = value === p;
        return (
          <TouchableOpacity
            key={p}
            activeOpacity={0.7}
            onPress={() => onChange(p)}
            style={[
              styles.priorityBtn,
              {
                backgroundColor: selected ? `${cfg.color}22` : theme.colors.surfaceAlt,
                borderColor: selected ? cfg.color : theme.colors.border,
                borderWidth: selected ? 1.5 : 1,
              },
            ]}
          >
            <Icon name={cfg.icon as any} size={14} color={cfg.color} />
            <Text
              variant="captionStrong"
              style={{ color: selected ? cfg.color : theme.colors.textMuted, fontSize: 11 }}
            >
              {cfg.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Field Row wrapper
// ---------------------------------------------------------------------------
const FieldRow: React.FC<{
  icon: string;
  label: string;
  children: React.ReactNode;
}> = ({ icon, label, children }) => {
  const theme = useTheme();
  return (
    <View style={styles.fieldRow}>
      <View style={[styles.fieldIcon, { backgroundColor: theme.colors.surfaceAlt }]}>
        <Icon name={icon as any} size={18} color={theme.colors.textMuted} />
      </View>
      <View style={styles.fieldContent}>
        <Text variant="caption" color="textMuted" style={styles.fieldLabel}>{label}</Text>
        {children}
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Simple date picker row (text-based, no native datepicker)
// ---------------------------------------------------------------------------
const DateField: React.FC<{
  value?: string;
  onChange: (v?: string) => void;
  label: string;
  icon: string;
}> = ({ value, onChange, label, icon }) => {
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState(value ?? "");

  const commit = () => {
    setEditing(false);
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) onChange(raw);
    else if (raw === "") onChange(undefined);
    else setRaw(value ?? "");
  };

  const displayVal = value
    ? new Date(value + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";

  return (
    <FieldRow icon={icon} label={label}>
      {editing ? (
        <TextInput
          style={[styles.dateInput, { color: theme.colors.text, borderColor: theme.colors.accent }]}
          value={raw}
          onChangeText={setRaw}
          onBlur={commit}
          onSubmitEditing={commit}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.colors.textSubtle}
          autoFocus
          keyboardType="numeric"
          maxLength={10}
        />
      ) : (
        <TouchableOpacity onPress={() => { setRaw(value ?? ""); setEditing(true); }}>
          <Text variant="body" color={value ? "text" : "textSubtle"}>{displayVal}</Text>
        </TouchableOpacity>
      )}
    </FieldRow>
  );
};

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export const TaskDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<DetailRoute>();
  const taskId = route.params?.id;
  const isNew = !taskId || taskId === "__new__";

  const getTaskById = usePlannerStore((s) => s.getTaskById);
  const addTask = usePlannerStore((s) => s.addTask);
  const updateTask = usePlannerStore((s) => s.updateTask);
  const deleteTask = usePlannerStore((s) => s.deleteTask);
  const toggleComplete = usePlannerStore((s) => s.toggleComplete);

  const existing = !isNew ? getTaskById(taskId) : undefined;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [priority, setPriority] = useState<Priority>(existing?.priority ?? "medium");
  const [dueDate, setDueDate] = useState<string | undefined>(existing?.dueDate);
  const [recurrence, setRecurrence] = useState<RecurrencePreset>(existing?.recurrence ?? "none");
  const [reminders, setReminders] = useState<Reminder[]>(existing?.reminders ?? []);
  const [isCompleted, setIsCompleted] = useState(existing?.isCompleted ?? false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>(isNew ? undefined : taskId);
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [showReminders, setShowReminders] = useState(false);

  const mark = useCallback(() => setIsDirty(true), []);

  const cfg = PRIORITY_CONFIG[priority];

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      Alert.alert("Required", "Task title cannot be empty.");
      return;
    }
    const payload = {
      title: title.trim(),
      notes: notes.trim() || undefined,
      priority,
      dueDate,
      recurrence,
      reminders,
      isCompleted,
      tags: existing?.tags ?? [],
    };
    if (savedId) {
      updateTask(savedId, payload);
    } else {
      const task = addTask(payload);
      setSavedId(task.id);
    }
    setIsDirty(false);
    navigation.goBack();
  }, [title, notes, priority, dueDate, recurrence, reminders, isCompleted, savedId]);

  const handleDelete = useCallback(() => {
    Alert.alert("Delete Task", `Delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (savedId) deleteTask(savedId);
          navigation.goBack();
        },
      },
    ]);
  }, [savedId, title, deleteTask, navigation]);

  const handleToggle = () => {
    setIsCompleted((v) => !v);
    if (savedId) toggleComplete(savedId);
    mark();
  };

  const handleBack = useCallback(() => {
    if (isDirty) {
      Alert.alert("Unsaved Changes", "Save before leaving?", [
        { text: "Discard", style: "destructive", onPress: () => navigation.goBack() },
        { text: "Save", onPress: handleSave },
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      navigation.goBack();
    }
  }, [isDirty, handleSave, navigation]);

  const reminderSummary =
    reminders.length === 0
      ? "None"
      : reminders
          .map((r) => REMINDER_OPTIONS.find((o) => o.value === r.minutesBefore)?.label ?? `${r.minutesBefore} min`)
          .join(", ");

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <Screen style={styles.screen}>
        <Header
          title={isNew ? "New Task" : "Task"}
          showBack
          onBack={handleBack}
          right={
            <View style={styles.headerActions}>
              {!isNew && (
                <TouchableOpacity onPress={handleDelete} style={styles.headerBtn}>
                  <Icon name="trash-outline" size={18} color={theme.colors.danger} />
                </TouchableOpacity>
              )}
            </View>
          }
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Completion toggle banner */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggle}
            style={[
              styles.completionBanner,
              {
                backgroundColor: isCompleted ? "#66BB6A22" : theme.colors.surfaceAlt,
                borderColor: isCompleted ? "#66BB6A" : theme.colors.border,
              },
            ]}
          >
            <Icon
              name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={isCompleted ? "#66BB6A" : theme.colors.textMuted}
            />
            <Text variant="bodyStrong" color={isCompleted ? "success" : "textMuted"}>
              {isCompleted ? "Completed ✓" : "Mark as complete"}
            </Text>
            {isCompleted && existing?.completedAt && (
              <Text variant="caption" color="textMuted" style={{ marginLeft: "auto" }}>
                {new Date(existing.completedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            )}
          </TouchableOpacity>

          {/* Title */}
          <Card padding="md" style={styles.titleCard}>
            <TextInput
              style={[
                styles.titleInput,
                { color: theme.colors.text },
                isCompleted && { textDecorationLine: "line-through", color: theme.colors.textMuted },
              ]}
              value={title}
              onChangeText={(t) => { setTitle(t); mark(); }}
              placeholder="What needs to be done?"
              placeholderTextColor={theme.colors.textSubtle}
              multiline
              maxLength={200}
              autoFocus={isNew}
            />

            {/* Priority selector */}
            <Divider style={{ marginVertical: 10 }} />
            <Text variant="caption" color="textMuted" style={styles.sectionLabel}>PRIORITY</Text>
            <PrioritySelector value={priority} onChange={(p) => { setPriority(p); mark(); }} />

            {/* Notes */}
            <Divider style={{ marginVertical: 10 }} />
            <Text variant="caption" color="textMuted" style={styles.sectionLabel}>NOTES</Text>
            <TextInput
              style={[styles.notesInput, { color: theme.colors.text }]}
              value={notes}
              onChangeText={(t) => { setNotes(t); mark(); }}
              placeholder="Add details, context, or sub-tasks..."
              placeholderTextColor={theme.colors.textSubtle}
              multiline
              textAlignVertical="top"
            />
          </Card>

          {/* Scheduling */}
          <Card padding="md" style={styles.card}>
            <Text variant="captionStrong" color="textMuted" style={styles.sectionLabel}>SCHEDULING</Text>

            <DateField
              icon="calendar-outline"
              label="Due Date"
              value={dueDate}
              onChange={(v) => { setDueDate(v); mark(); }}
            />

            <Divider style={{ marginVertical: 8 }} />

            {/* Recurrence */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowRecurrence(true)}
              style={styles.fieldRow}
            >
              <View style={[styles.fieldIcon, { backgroundColor: theme.colors.surfaceAlt }]}>
                <Icon name="repeat-outline" size={18} color={theme.colors.textMuted} />
              </View>
              <View style={styles.fieldContent}>
                <Text variant="caption" color="textMuted" style={styles.fieldLabel}>Repeat</Text>
                <Text variant="body" color={recurrence !== "none" ? "text" : "textSubtle"}>
                  {RECURRENCE_LABELS[recurrence]}
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>

            <Divider style={{ marginVertical: 8 }} />

            {/* Reminders */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowReminders(true)}
              style={styles.fieldRow}
            >
              <View style={[styles.fieldIcon, { backgroundColor: theme.colors.surfaceAlt }]}>
                <Icon name="notifications-outline" size={18} color={theme.colors.textMuted} />
              </View>
              <View style={styles.fieldContent}>
                <Text variant="caption" color="textMuted" style={styles.fieldLabel}>Reminders</Text>
                <Text
                  variant="body"
                  color={reminders.length > 0 ? "text" : "textSubtle"}
                  numberOfLines={1}
                >
                  {reminderSummary}
                </Text>
              </View>
              <View style={styles.reminderBadgeRow}>
                {reminders.length > 0 && (
                  <Badge label={String(reminders.length)} tone="info" />
                )}
                <Icon name="chevron-forward" size={16} color={theme.colors.textMuted} />
              </View>
            </TouchableOpacity>
          </Card>

          {/* Tags */}
          {existing?.tags && existing.tags.length > 0 && (
            <Card padding="md" style={styles.card}>
              <Text variant="captionStrong" color="textMuted" style={styles.sectionLabel}>TAGS</Text>
              <View style={styles.tagsRow}>
                {existing.tags.map((tag) => (
                  <View
                    key={tag}
                    style={[styles.tagPill, { backgroundColor: theme.colors.accentSubtle }]}
                  >
                    <Text variant="caption" color="accent">{tag}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Save */}
          <Button
            label={isNew ? "Create Task" : "Save Changes"}
            variant="primary"
            size="lg"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </ScrollView>

        {/* Pickers */}
        <RecurrencePicker
          visible={showRecurrence}
          value={recurrence}
          onClose={() => setShowRecurrence(false)}
          onChange={(v) => { setRecurrence(v); mark(); }}
        />
        <ReminderPicker
          visible={showReminders}
          reminders={reminders}
          onClose={() => setShowReminders(false)}
          onChange={(v) => { setReminders(v); mark(); }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { flex: 1 },
  headerActions: { flexDirection: "row", gap: 8 },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  completionBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  titleCard: { borderRadius: 16, gap: 0 },
  card: { borderRadius: 16 },
  titleInput: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 26,
    minHeight: 50,
  },
  sectionLabel: {
    letterSpacing: 0.5,
    marginBottom: 8,
    fontSize: 11,
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
  },
  notesInput: {
    fontSize: 14,
    lineHeight: 22,
    minHeight: 80,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 44,
  },
  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldContent: {
    flex: 1,
    gap: 2,
  },
  fieldLabel: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
  dateInput: {
    fontSize: 14,
    borderBottomWidth: 1,
    paddingBottom: 2,
    paddingTop: 0,
  },
  reminderBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  saveBtn: {
    marginTop: 8,
  },
});

export default TaskDetailScreen;
