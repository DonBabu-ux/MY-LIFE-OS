/**
 * DiaryCalendarScreen — month grid with mood dots per day.
 * Tap a day to open/create that day's entry.
 * Batch 7.2
 */

import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Icon,
} from "../../../components";
import { Routes } from "../../../navigation/routes";
import { useDiaryStore } from "../state/diarySlice";
import { MOODS } from "../mock";
import type { MoodLevel } from "../mock";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ---------------------------------------------------------------------------
// Day Cell
// ---------------------------------------------------------------------------
const DayCell: React.FC<{
  day: number | null;
  mood?: MoodLevel;
  isToday: boolean;
  hasEntry: boolean;
  isSelected: boolean;
  onPress: () => void;
}> = ({ day, mood, isToday, hasEntry, isSelected, onPress }) => {
  const theme = useTheme();

  if (day === null) return <View style={styles.dayCell} />;

  const moodColor = mood ? MOODS.find((m) => m.level === mood)?.color : undefined;
  const moodEmoji = mood ? MOODS.find((m) => m.level === mood)?.emoji : undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.dayCell,
        isSelected && { backgroundColor: moodColor ?? theme.colors.accent, borderRadius: 12 },
        isToday && !isSelected && {
          borderWidth: 1.5,
          borderColor: theme.colors.accent,
          borderRadius: 12,
        },
      ]}
    >
      <Text
        variant="body"
        style={[
          styles.dayText,
          {
            color: isSelected
              ? "#fff"
              : isToday
              ? theme.colors.accent
              : theme.colors.text,
            fontWeight: isToday || hasEntry ? "700" : "400",
          },
        ]}
      >
        {day}
      </Text>
      {hasEntry && (
        <Text style={styles.moodDot}>{moodEmoji ?? "•"}</Text>
      )}
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Selected Day Entry Preview
// ---------------------------------------------------------------------------
const DayPreview: React.FC<{
  dateStr: string;
  onOpen: () => void;
  onNew: () => void;
}> = ({ dateStr, onOpen, onNew }) => {
  const theme = useTheme();
  const entry = useDiaryStore((s) => s.getEntryForDate(dateStr));

  if (!entry) {
    return (
      <Card padding="md" style={styles.previewCard}>
        <View style={styles.previewEmpty}>
          <Icon name="pencil-outline" size={22} color={theme.colors.textMuted} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong" color="textMuted">No entry for this day</Text>
            <Text variant="caption" color="textSubtle">Tap to start writing</Text>
          </View>
          <TouchableOpacity
            onPress={onNew}
            style={[styles.previewBtn, { backgroundColor: theme.colors.accent }]}
          >
            <Icon name="add" size={18} color={theme.colors.onAccent} />
            <Text variant="captionStrong" style={{ color: theme.colors.onAccent }}>Write</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }

  const mood = MOODS.find((m) => m.level === entry.mood)!;
  const title = entry.title || entry.body.split("\n")[0].replace(/^#+\s*/, "").slice(0, 60) || "Untitled";
  const preview = entry.body
    .replace(/#+\s/g, "")
    .replace(/\*\*/g, "")
    .trim()
    .slice(0, 100);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onOpen}>
      <Card padding="md" style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <View
            style={[styles.moodBadge, { backgroundColor: `${mood.color}22` }]}
          >
            <Text style={{ fontSize: 20 }}>{mood.emoji}</Text>
            <Text variant="captionStrong" style={{ color: mood.color }}>{mood.label}</Text>
          </View>
          {entry.isPrivate && (
            <Icon name="lock-closed-outline" size={14} color={theme.colors.textMuted} />
          )}
          {entry.media.length > 0 && (
            <View style={styles.mediaBadge}>
              <Icon name="image-outline" size={12} color={theme.colors.textMuted} />
              <Text variant="caption" color="textMuted">{entry.media.length}</Text>
            </View>
          )}
          <View style={{ flex: 1 }} />
          <Icon name="chevron-forward" size={16} color={theme.colors.textMuted} />
        </View>
        <Text variant="bodyStrong" numberOfLines={1}>{title}</Text>
        {preview.length > 0 && (
          <Text variant="caption" color="textSubtle" numberOfLines={2}>{preview}</Text>
        )}
      </Card>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export const DiaryCalendarScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const getEntriesForMonth = useDiaryStore((s) => s.getEntriesForMonth);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

  const monthEntries = useMemo(
    () => getEntriesForMonth(viewYear, viewMonth),
    [viewYear, viewMonth, getEntriesForMonth]
  );

  // Build entry map: day -> mood
  const entryMap = useMemo(() => {
    const map: Record<number, MoodLevel> = {};
    for (const e of monthEntries) {
      const d = new Date(e.date).getDate();
      map[d] = e.mood;
    }
    return map;
  }, [monthEntries]);

  // Build calendar grid
  const { weeks, daysInMonth } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return { weeks, daysInMonth };
  }, [viewYear, viewMonth]);

  const navigateMonth = (dir: -1 | 1) => {
    const d = new Date(viewYear, viewMonth + dir, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setSelectedDay(1);
  };

  const selectedDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

  // Month mood summary
  const moodCounts = useMemo(() => {
    const counts: Record<MoodLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const e of monthEntries) counts[e.mood]++;
    return counts;
  }, [monthEntries]);

  const avgMood =
    monthEntries.length > 0
      ? monthEntries.reduce((sum, e) => sum + e.mood, 0) / monthEntries.length
      : null;

  return (
    <Screen>
      <Header
        title="Calendar"
        showBack
        right={
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.DiaryTimeline)}
            style={styles.headerBtn}
          >
            <Icon name="list-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Month Navigator */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navBtn}>
            <Icon name="chevron-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.monthTitle}>
            <Text variant="h3">{MONTH_NAMES[viewMonth]}</Text>
            <Text variant="captionStrong" color="textMuted">{viewYear}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigateMonth(1)}
            style={styles.navBtn}
            disabled={viewYear === today.getFullYear() && viewMonth >= today.getMonth()}
          >
            <Icon
              name="chevron-forward"
              size={22}
              color={
                viewYear === today.getFullYear() && viewMonth >= today.getMonth()
                  ? theme.colors.border
                  : theme.colors.text
              }
            />
          </TouchableOpacity>
        </View>

        {/* Weekday headers */}
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((wd) => (
            <View key={wd} style={styles.weekdayCell}>
              <Text variant="caption" color="textMuted" style={styles.weekdayText}>
                {wd}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <Card padding="sm" style={styles.calendarCard}>
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((day, di) => {
                const isToday =
                  day !== null &&
                  day === today.getDate() &&
                  viewMonth === today.getMonth() &&
                  viewYear === today.getFullYear();
                return (
                  <DayCell
                    key={di}
                    day={day}
                    mood={day !== null ? entryMap[day] : undefined}
                    hasEntry={day !== null && entryMap[day] !== undefined}
                    isToday={isToday}
                    isSelected={day === selectedDay}
                    onPress={() => day !== null && setSelectedDay(day)}
                  />
                );
              })}
            </View>
          ))}
        </Card>

        {/* Month summary */}
        {monthEntries.length > 0 && (
          <Card padding="md" style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text variant="bodyStrong">
                {MONTH_NAMES[viewMonth]} Summary
              </Text>
              <View style={styles.avgMoodBadge}>
                <Text style={{ fontSize: 16 }}>
                  {avgMood !== null
                    ? MOODS.find((m) => m.level === Math.round(avgMood) as MoodLevel)?.emoji
                    : "—"}
                </Text>
                <Text variant="caption" color="textMuted">
                  avg mood
                </Text>
              </View>
            </View>
            <Text variant="caption" color="textMuted" style={{ marginBottom: 10 }}>
              {monthEntries.length} of {daysInMonth} days recorded
            </Text>
            <View style={styles.moodBar}>
              {MOODS.map((m) => {
                const count = moodCounts[m.level];
                const pct = monthEntries.length > 0 ? count / monthEntries.length : 0;
                if (pct === 0) return null;
                return (
                  <View
                    key={m.level}
                    style={[
                      styles.moodBarSegment,
                      { flex: pct, backgroundColor: m.color },
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.moodLegend}>
              {MOODS.map((m) => (
                <View key={m.level} style={styles.moodLegendItem}>
                  <Text style={{ fontSize: 13 }}>{m.emoji}</Text>
                  <Text variant="caption" color="textMuted">{moodCounts[m.level]}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Selected day preview */}
        <View style={styles.previewSection}>
          <Text variant="captionStrong" color="textMuted" style={styles.previewLabel}>
            {selectedDay}{" "}
            {MONTH_NAMES[viewMonth].toUpperCase()}
          </Text>
          <DayPreview
            dateStr={selectedDateStr}
            onOpen={() => {
              const entry = useDiaryStore.getState().getEntryForDate(selectedDateStr);
              if (entry) navigation.navigate(Routes.DiaryEditor, { id: entry.id });
            }}
            onNew={() => navigation.navigate(Routes.DiaryEditor, {})}
          />
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate(Routes.DiaryEditor, {})}
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
      >
        <Icon name="add" size={28} color={theme.colors.onAccent} />
      </TouchableOpacity>
    </Screen>
  );
};

const CELL_SIZE = 44;

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 90,
    gap: 16,
  },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: {
    alignItems: "center",
    gap: 2,
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  weekdayText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  calendarCard: {
    borderRadius: 20,
    gap: 4,
  },
  weekRow: {
    flexDirection: "row",
  },
  dayCell: {
    flex: 1,
    height: CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dayText: {
    fontSize: 14,
    lineHeight: 18,
  },
  moodDot: {
    fontSize: 10,
    lineHeight: 12,
  },
  summaryCard: {
    borderRadius: 16,
    gap: 0,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  avgMoodBadge: {
    alignItems: "center",
    gap: 2,
  },
  moodBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: "row",
    overflow: "hidden",
    gap: 2,
    marginBottom: 10,
  },
  moodBarSegment: {
    borderRadius: 4,
  },
  moodLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  moodLegendItem: {
    alignItems: "center",
    gap: 2,
  },
  previewSection: {
    gap: 8,
  },
  previewLabel: {
    letterSpacing: 0.5,
  },
  previewCard: {
    borderRadius: 16,
    gap: 8,
  },
  previewEmpty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  moodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  mediaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
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

export default DiaryCalendarScreen;
