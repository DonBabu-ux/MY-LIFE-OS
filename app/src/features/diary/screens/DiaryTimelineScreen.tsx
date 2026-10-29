/**
 * DiaryTimelineScreen — newest-first list of diary entries.
 * Features: mood chip, media thumbnails, private lock icon, pull-to-refresh.
 * Batch 7.1
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
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
  EmptyState,
  Button,
  Divider,
} from "../../../components";
import { Routes } from "../../../navigation/routes";
import { useDiaryStore } from "../state/diarySlice";
import { MOODS } from "../mock";
import type { DiaryEntry } from "../mock";

// ---------------------------------------------------------------------------
// Mood chip
// ---------------------------------------------------------------------------
const MoodChip: React.FC<{ level: import("../mock").MoodLevel; compact?: boolean }> = ({
  level,
  compact = false,
}) => {
  const theme = useTheme();
  const mood = MOODS.find((m) => m.level === level)!;
  return (
    <View
      style={[
        styles.moodChip,
        { backgroundColor: `${mood.color}22`, borderColor: `${mood.color}55` },
        compact && styles.moodChipCompact,
      ]}
    >
      <Text style={{ fontSize: compact ? 12 : 14 }}>{mood.emoji}</Text>
      {!compact && (
        <Text variant="caption" style={{ color: mood.color, fontWeight: "600" }}>
          {mood.label}
        </Text>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Media thumbnail strip
// ---------------------------------------------------------------------------
const MediaStrip: React.FC<{ entry: DiaryEntry }> = ({ entry }) => {
  const theme = useTheme();
  if (entry.media.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.mediaStripRow}
    >
      {entry.media.map((m) => (
        <View
          key={m.id}
          style={[styles.mediaThumbnail, { backgroundColor: m.thumbColor }]}
        >
          {m.type === "voice" && (
            <Icon name="mic" size={16} color="#fff" />
          )}
          {m.type === "video" && (
            <Icon name="play-circle" size={18} color="#fff" />
          )}
          {m.type === "image" && (
            <Icon name="image" size={16} color="rgba(255,255,255,0.7)" />
          )}
          {m.durationSec && (
            <Text style={styles.mediaDuration}>{m.durationSec}s</Text>
          )}
        </View>
      ))}
      {entry.media.length > 3 && (
        <View style={[styles.mediaThumbnail, { backgroundColor: theme.colors.border }]}>
          <Text variant="captionStrong" color="textMuted">
            +{entry.media.length - 3}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

// ---------------------------------------------------------------------------
// Entry Card
// ---------------------------------------------------------------------------
const EntryCard: React.FC<{
  entry: DiaryEntry;
  onPress: () => void;
}> = ({ entry, onPress }) => {
  const theme = useTheme();
  const mood = MOODS.find((m) => m.level === entry.mood)!;

  const displayTitle =
    entry.title ||
    entry.body.split("\n")[0].replace(/^#+\s*/, "").slice(0, 60) ||
    "Untitled Entry";

  const bodyPreview = entry.body
    .replace(/#+\s/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\[.*?\]/g, "")
    .trim();

  const entryDate = new Date(entry.date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - entryDate.getTime()) / 86400000);

  let dateLabel = "";
  if (diffDays === 0) dateLabel = "Today";
  else if (diffDays === 1) dateLabel = "Yesterday";
  else if (diffDays < 7) dateLabel = `${diffDays} days ago`;
  else
    dateLabel = entryDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: entryDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
      <Card padding="md" style={styles.entryCard}>
        {/* Date + mood chip row */}
        <View style={styles.entryHeader}>
          <View style={styles.datePart}>
            <Text
              style={[styles.dayNum, { color: mood.color }]}
            >
              {entryDate.getDate()}
            </Text>
            <View>
              <Text variant="captionStrong" color="textMuted">
                {entryDate.toLocaleDateString(undefined, { month: "short" }).toUpperCase()}
              </Text>
              <Text variant="caption" color="textSubtle">
                {entryDate.toLocaleDateString(undefined, { weekday: "short" })}
              </Text>
            </View>
          </View>
          <View style={styles.entryHeaderRight}>
            <MoodChip level={entry.mood} />
            {entry.isPrivate && (
              <View style={[styles.lockBadge, { backgroundColor: theme.colors.surfaceAlt }]}>
                <Icon name="lock-closed" size={12} color={theme.colors.textMuted} />
              </View>
            )}
          </View>
        </View>

        <View style={[styles.timelineLine, { backgroundColor: `${mood.color}40` }]} />

        {/* Content */}
        <View style={styles.entryContent}>
          <Text variant="bodyStrong" numberOfLines={1} style={styles.entryTitle}>
            {displayTitle}
          </Text>
          {bodyPreview.length > 0 && (
            <Text variant="caption" color="textSubtle" numberOfLines={2} style={styles.entryPreview}>
              {bodyPreview}
            </Text>
          )}

          {/* Media strip */}
          <MediaStrip entry={entry} />

          {/* Tags + relative time */}
          <View style={styles.entryFooter}>
            <View style={styles.entryTags}>
              {entry.tags.slice(0, 3).map((tag, i) => (
                <View
                  key={i}
                  style={[styles.tagPill, { backgroundColor: theme.colors.surfaceAlt }]}
                >
                  <Text variant="caption" color="textMuted" style={{ fontSize: 11 }}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
            <Text variant="caption" color="textSubtle">
              {dateLabel}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export const DiaryTimelineScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const entries = useDiaryStore((s) => s.entries);
  const streak = useDiaryStore((s) => s.getMoodStreakDays());

  const [refreshing, setRefreshing] = useState(false);
  const [moodFilter, setMoodFilter] = useState<import("../mock").MoodLevel | null>(null);
  const [showPrivate, setShowPrivate] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const filtered = useMemo(() => {
    let result = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (moodFilter !== null) result = result.filter((e) => e.mood === moodFilter);
    if (!showPrivate) result = result.filter((e) => !e.isPrivate);
    return result;
  }, [entries, moodFilter, showPrivate]);

  const todayEntry = entries.find(
    (e) => e.date === new Date().toISOString().slice(0, 10)
  );

  return (
    <Screen style={styles.container}>
      <Header
        title="Diary"
        subtitle={`${entries.length} entries · ${streak} day streak`}
        right={
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => setShowPrivate((v) => !v)}
              style={[
                styles.headerBtn,
                !showPrivate && { backgroundColor: theme.colors.accentSubtle },
              ]}
            >
              <Icon
                name={showPrivate ? "eye-outline" : "eye-off-outline"}
                size={18}
                color={!showPrivate ? theme.colors.accent : theme.colors.textMuted}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.DiaryCalendar)}
              style={styles.headerBtn}
            >
              <Icon name="calendar-outline" size={18} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Mood filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodFilters}
      >
        <TouchableOpacity
          onPress={() => setMoodFilter(null)}
          style={[
            styles.moodFilterChip,
            {
              backgroundColor: moodFilter === null ? theme.colors.accentSubtle : theme.colors.surface,
              borderColor: moodFilter === null ? theme.colors.accent : theme.colors.border,
            },
          ]}
        >
          <Text variant="captionStrong" color={moodFilter === null ? "accent" : "textMuted"}>
            All Moods
          </Text>
        </TouchableOpacity>
        {MOODS.map((m) => {
          const active = moodFilter === m.level;
          return (
            <TouchableOpacity
              key={m.level}
              onPress={() => setMoodFilter(active ? null : m.level)}
              style={[
                styles.moodFilterChip,
                {
                  backgroundColor: active ? `${m.color}22` : theme.colors.surface,
                  borderColor: active ? m.color : theme.colors.border,
                },
              ]}
            >
              <Text style={{ fontSize: 14 }}>{m.emoji}</Text>
              <Text
                variant="captionStrong"
                style={{ color: active ? m.color : theme.colors.textMuted }}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Divider />

      {/* Today's status banner */}
      {!todayEntry && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate(Routes.DiaryEditor, {})}
          style={[styles.todayBanner, { backgroundColor: theme.colors.accentSubtle, borderColor: theme.colors.accent }]}
        >
          <Icon name="pencil-outline" size={18} color={theme.colors.accent} />
          <Text variant="bodyStrong" color="accent" style={{ flex: 1 }}>
            How are you feeling today?
          </Text>
          <Icon name="chevron-forward" size={16} color={theme.colors.accent} />
        </TouchableOpacity>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Icon name="book-outline" size={48} color={theme.colors.textMuted} />}
            title={moodFilter !== null ? "No Entries Match" : "No Diary Entries"}
            description={
              moodFilter !== null
                ? "Try selecting a different mood filter."
                : "Start writing your first diary entry today."
            }
            action={
              moodFilter !== null ? (
                <Button label="Clear Filter" variant="secondary" onPress={() => setMoodFilter(null)} />
              ) : (
                <Button
                  label="Write Today's Entry"
                  variant="primary"
                  onPress={() => navigation.navigate(Routes.DiaryEditor, {})}
                />
              )
            }
          />
        }
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onPress={() => navigation.navigate(Routes.DiaryEditor, { id: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  moodFilters: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: "center",
  },
  moodFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  todayBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  entryCard: {
    borderRadius: 16,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  entryHeader: {
    alignItems: "center",
    gap: 6,
  },
  datePart: {
    alignItems: "center",
    gap: 2,
  },
  dayNum: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 26,
  },
  entryHeaderRight: {
    alignItems: "center",
    gap: 4,
  },
  moodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  moodChipCompact: {
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  lockBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    borderRadius: 2,
    minHeight: 20,
  },
  entryContent: {
    flex: 1,
    gap: 6,
  },
  entryTitle: {
    fontSize: 15,
  },
  entryPreview: {
    lineHeight: 18,
  },
  mediaStripRow: {
    gap: 6,
    paddingTop: 2,
  },
  mediaThumbnail: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mediaDuration: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    position: "absolute",
    bottom: 3,
    right: 4,
  },
  entryFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 2,
  },
  entryTags: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
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

export default DiaryTimelineScreen;
