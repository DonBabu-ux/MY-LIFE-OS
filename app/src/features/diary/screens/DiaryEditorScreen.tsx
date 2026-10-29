/**
 * DiaryEditorScreen — Create / Edit a diary entry.
 * Features: date picker, title, body, mood picker, media strip,
 *           private toggle, save & delete.
 * Batch 7.3
 */

import React, { useState, useCallback, useRef } from "react";
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
} from "../../../components";
import { useDiaryStore } from "../state/diarySlice";
import { MoodPicker } from "../components/MoodPicker";
import { MediaCaptureSheet } from "../components/MediaCaptureSheet";
import type { VaultStackParamList } from "../../../navigation/types";
import { MOODS } from "../mock";
import type { MoodLevel, DiaryMedia } from "../mock";

type EditorRoute = RouteProp<VaultStackParamList, "DiaryEditor">;

// ---------------------------------------------------------------------------
// Date Navigator
// ---------------------------------------------------------------------------
const DateNavigator: React.FC<{
  date: Date;
  onChange: (d: Date) => void;
  maxDate: Date;
}> = ({ date, onChange, maxDate }) => {
  const theme = useTheme();

  const prev = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    onChange(d);
  };

  const next = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    if (d <= maxDate) onChange(d);
  };

  const isToday = date.toDateString() === maxDate.toDateString();

  return (
    <View style={styles.dateNav}>
      <TouchableOpacity onPress={prev} style={styles.dateNavBtn}>
        <Icon name="chevron-back" size={20} color={theme.colors.text} />
      </TouchableOpacity>
      <View style={styles.dateCenter}>
        <Text variant="h3">
          {date.toLocaleDateString(undefined, { weekday: "long" })}
        </Text>
        <Text variant="caption" color="textMuted">
          {date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
        {isToday && (
          <View style={[styles.todayBadge, { backgroundColor: theme.colors.accentSubtle }]}>
            <Text variant="caption" color="accent" style={{ fontSize: 10 }}>
              TODAY
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={next}
        style={styles.dateNavBtn}
        disabled={isToday}
      >
        <Icon
          name="chevron-forward"
          size={20}
          color={isToday ? theme.colors.border : theme.colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Media Thumbnail
// ---------------------------------------------------------------------------
const MediaThumb: React.FC<{
  media: DiaryMedia;
  onRemove: () => void;
  onCaptionEdit: () => void;
}> = ({ media, onRemove, onCaptionEdit }) => {
  const theme = useTheme();
  return (
    <View style={styles.thumbOuter}>
      <TouchableOpacity activeOpacity={0.8} onPress={onCaptionEdit}>
        <View style={[styles.thumb, { backgroundColor: media.thumbColor }]}>
          {media.type === "image" && <Icon name="image" size={20} color="rgba(255,255,255,0.8)" />}
          {media.type === "video" && <Icon name="play-circle" size={22} color="#fff" />}
          {media.type === "voice" && <Icon name="mic" size={20} color="#fff" />}
          {media.durationSec && (
            <Text style={styles.thumbDuration}>{media.durationSec}s</Text>
          )}
        </View>
        {media.caption && (
          <Text
            variant="caption"
            color="textMuted"
            numberOfLines={1}
            style={styles.thumbCaption}
          >
            {media.caption}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={onRemove} style={styles.thumbRemove}>
        <Icon name="close-circle" size={18} color={theme.colors.danger} />
      </TouchableOpacity>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export const DiaryEditorScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<EditorRoute>();
  const entryId = route.params?.id;

  const getEntryById = useDiaryStore((s) => s.getEntryById);
  const addEntry = useDiaryStore((s) => s.addEntry);
  const updateEntry = useDiaryStore((s) => s.updateEntry);
  const deleteEntry = useDiaryStore((s) => s.deleteEntry);

  const existing = entryId ? getEntryById(entryId) : undefined;

  const today = new Date();
  const [date, setDate] = useState<Date>(
    existing ? new Date(existing.date) : today
  );
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [mood, setMood] = useState<MoodLevel>(existing?.mood ?? 3);
  const [media, setMedia] = useState<DiaryMedia[]>(existing?.media ?? []);
  const [isPrivate, setIsPrivate] = useState(existing?.isPrivate ?? false);
  const [showMediaSheet, setShowMediaSheet] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>(entryId);

  const bodyRef = useRef<TextInput>(null);
  const markDirty = useCallback(() => setIsDirty(true), []);

  const selectedMood = MOODS.find((m) => m.level === mood)!;

  const dateStr = (d: Date) => d.toISOString().slice(0, 10);

  const handleSave = useCallback(() => {
    if (!body.trim() && !title.trim()) {
      Alert.alert("Empty Entry", "Please write something before saving.");
      return;
    }
    const payload = {
      date: dateStr(date),
      title: title.trim(),
      body: body.trim(),
      mood,
      media,
      isPrivate,
      tags: [],
    };
    if (savedId) {
      updateEntry(savedId, payload);
    } else {
      const entry = addEntry(payload);
      setSavedId(entry.id);
    }
    setIsDirty(false);
    navigation.goBack();
  }, [title, body, date, mood, media, isPrivate, savedId]);

  const handleDelete = useCallback(() => {
    Alert.alert("Delete Entry", "This entry will be permanently deleted.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (savedId) deleteEntry(savedId);
          navigation.goBack();
        },
      },
    ]);
  }, [savedId, deleteEntry, navigation]);

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

  const removeMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    markDirty();
  };

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <Screen style={styles.screen}>
        <Header
          title={existing ? "Edit Entry" : "New Entry"}
          showBack
          onBack={handleBack}
          right={
            <View style={styles.headerActions}>
              {existing && (
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
          {/* Date Navigator */}
          <DateNavigator date={date} onChange={(d) => { setDate(d); markDirty(); }} maxDate={today} />

          <Divider style={{ marginVertical: 16 }} />

          {/* Mood Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="captionStrong" color="textMuted">HOW ARE YOU FEELING?</Text>
              <View style={[styles.selectedMoodBadge, { backgroundColor: `${selectedMood.color}22` }]}>
                <Text style={{ fontSize: 16 }}>{selectedMood.emoji}</Text>
                <Text variant="captionStrong" style={{ color: selectedMood.color }}>
                  {selectedMood.label}
                </Text>
              </View>
            </View>
            <MoodPicker
              value={mood}
              onChange={(level) => { setMood(level); markDirty(); }}
              size="md"
            />
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Title */}
          <TextInput
            style={[styles.titleInput, { color: theme.colors.text }]}
            value={title}
            onChangeText={(t) => { setTitle(t); markDirty(); }}
            placeholder="Give this day a title (optional)..."
            placeholderTextColor={theme.colors.textSubtle}
            maxLength={120}
            returnKeyType="next"
            onSubmitEditing={() => bodyRef.current?.focus()}
          />

          {/* Body */}
          <TextInput
            ref={bodyRef}
            style={[styles.bodyInput, { color: theme.colors.text }]}
            value={body}
            onChangeText={(t) => { setBody(t); markDirty(); }}
            placeholder={`What happened today? What are you thinking about?\n\nThis is your space — be honest.`}
            placeholderTextColor={theme.colors.textSubtle}
            multiline
            textAlignVertical="top"
          />

          <Text variant="caption" color="textSubtle" style={styles.wordCount}>
            {wordCount} word{wordCount !== 1 ? "s" : ""}
          </Text>

          <Divider style={{ marginVertical: 16 }} />

          {/* Media Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="captionStrong" color="textMuted">
                MEDIA {media.length > 0 ? `(${media.length})` : ""}
              </Text>
              <TouchableOpacity
                onPress={() => setShowMediaSheet(true)}
                style={[styles.addMediaBtn, { borderColor: theme.colors.accent }]}
              >
                <Icon name="add" size={14} color={theme.colors.accent} />
                <Text variant="captionStrong" color="accent">Add</Text>
              </TouchableOpacity>
            </View>

            {media.length === 0 ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowMediaSheet(true)}
                style={[styles.mediaEmptyArea, { borderColor: theme.colors.border }]}
              >
                <Icon name="camera-outline" size={24} color={theme.colors.textMuted} />
                <Text variant="caption" color="textMuted">
                  Add photos, videos, or a voice memo
                </Text>
              </TouchableOpacity>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mediaRow}
              >
                {media.map((m) => (
                  <MediaThumb
                    key={m.id}
                    media={m}
                    onRemove={() => removeMedia(m.id)}
                    onCaptionEdit={() => {}}
                  />
                ))}
                <TouchableOpacity
                  onPress={() => setShowMediaSheet(true)}
                  style={[styles.addMediaThumb, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceAlt }]}
                >
                  <Icon name="add" size={22} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Privacy Toggle */}
          <Card padding="md" style={styles.privacyCard}>
            <View style={styles.privacyRow}>
              <View style={[styles.privacyIconWrap, {
                backgroundColor: isPrivate ? "#AB47BC22" : theme.colors.surfaceAlt,
              }]}>
                <Icon
                  name={isPrivate ? "lock-closed" : "lock-open-outline"}
                  size={20}
                  color={isPrivate ? "#AB47BC" : theme.colors.textMuted}
                />
              </View>
              <View style={styles.privacyText}>
                <Text variant="bodyStrong">
                  {isPrivate ? "Private Entry" : "Normal Entry"}
                </Text>
                <Text variant="caption" color="textMuted">
                  {isPrivate
                    ? "Hidden from timelines unless unlocked"
                    : "Visible in your diary timeline"}
                </Text>
              </View>
              <Switch
                value={isPrivate}
                onValueChange={(v) => { setIsPrivate(v); markDirty(); }}
                trackColor={{ false: theme.colors.border, true: "#AB47BC" }}
                thumbColor="#fff"
              />
            </View>
          </Card>

          {/* Save Button */}
          <Button
            label="Save Entry"
            variant="primary"
            size="lg"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </ScrollView>

        {/* Media Sheet */}
        <MediaCaptureSheet
          visible={showMediaSheet}
          onClose={() => setShowMediaSheet(false)}
          onMediaAdded={(m) => {
            setMedia((prev) => [...prev, m]);
            markDirty();
          }}
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
  },
  dateNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateNavBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCenter: {
    alignItems: "center",
    gap: 3,
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedMoodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  bodyInput: {
    fontSize: 15,
    lineHeight: 24,
    minHeight: 200,
  },
  wordCount: {
    textAlign: "right",
    marginTop: 6,
  },
  mediaEmptyArea: {
    height: 80,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexDirection: "row",
  },
  mediaRow: {
    gap: 10,
    paddingBottom: 4,
  },
  thumbOuter: {
    position: "relative",
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbDuration: {
    position: "absolute",
    bottom: 4,
    right: 5,
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  thumbCaption: {
    marginTop: 4,
    width: 80,
    textAlign: "center",
    fontSize: 10,
  },
  thumbRemove: {
    position: "absolute",
    top: -6,
    right: -6,
  },
  addMediaThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addMediaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  privacyCard: {
    borderRadius: 16,
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  privacyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  privacyText: {
    flex: 1,
    gap: 2,
  },
  saveBtn: {
    marginTop: 24,
  },
});

export default DiaryEditorScreen;
