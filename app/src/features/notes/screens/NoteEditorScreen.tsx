/**
 * NoteEditorScreen — Create / Edit a note.
 * Features: title, body (rich-ish text), tags, attachments, save / pin / delete.
 * Batch 6.2
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Text,
  Icon,
  Button,
  Divider,
  Card,
  Chip,
} from "../../../components";
import { useNotesStore } from "../state/notesSlice";
import { AttachmentPicker } from "../components/AttachmentPicker";
import type { VaultStackParamList } from "../../../navigation/types";
import type { NoteAttachment } from "../mock";

type EditorRoute = RouteProp<VaultStackParamList, "NoteEditor">;

// ---------------------------------------------------------------------------
// Toolbar Button
// ---------------------------------------------------------------------------
const ToolbarBtn: React.FC<{ icon: string; label?: string; onPress: () => void; active?: boolean }> = ({
  icon, label, onPress, active,
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.toolbarBtn, active && { backgroundColor: theme.colors.accentSubtle }]}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <Icon name={icon} size={20} color={active ? theme.colors.accent : theme.colors.textMuted} />
      {label && <Text variant="caption" color={active ? "accent" : "textMuted"} style={{ fontSize: 10 }}>{label}</Text>}
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Attachment Thumbnail
// ---------------------------------------------------------------------------
const AttachmentThumbnail: React.FC<{
  attachment: NoteAttachment;
  onRemove: () => void;
}> = ({ attachment, onRemove }) => {
  const theme = useTheme();
  const isImage = attachment.type === "image";
  return (
    <View style={[styles.thumbContainer, { borderColor: theme.colors.border }]}>
      <View style={[styles.thumb, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Icon
          name={isImage ? "image-outline" : "document-outline"}
          size={24}
          color={theme.colors.textMuted}
        />
      </View>
      <Text variant="caption" color="textMuted" numberOfLines={1} style={styles.thumbName}>
        {attachment.name}
      </Text>
      <TouchableOpacity onPress={onRemove} style={styles.thumbRemove}>
        <Icon name="close-circle" size={16} color={theme.colors.danger} />
      </TouchableOpacity>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export const NoteEditorScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<EditorRoute>();
  const noteId = route.params?.id;

  const getNoteById = useNotesStore((s) => s.getNoteById);
  const tags = useNotesStore((s) => s.tags);
  const addNote = useNotesStore((s) => s.addNote);
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const togglePin = useNotesStore((s) => s.togglePin);

  const existingNote = noteId ? getNoteById(noteId) : undefined;

  const [title, setTitle] = useState(existingNote?.title ?? "");
  const [body, setBody] = useState(existingNote?.body ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(existingNote?.tagIds ?? []);
  const [attachments, setAttachments] = useState<NoteAttachment[]>(existingNote?.attachments ?? []);
  const [isPinned, setIsPinned] = useState(existingNote?.isPinned ?? false);
  const [isFavorite, setIsFavorite] = useState(existingNote?.isFavorite ?? false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showAttachmentPicker, setShowAttachmentPicker] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>(noteId);

  const bodyRef = useRef<TextInput>(null);

  const markDirty = useCallback(() => setIsDirty(true), []);

  const handleSave = useCallback(() => {
    if (!title.trim() && !body.trim()) {
      Alert.alert("Empty Note", "Please add a title or body before saving.");
      return;
    }
    if (savedId) {
      updateNote(savedId, { title, body, tagIds: selectedTagIds, attachments, isPinned, isFavorite });
    } else {
      const note = addNote({
        title,
        body,
        folderId: null,
        tagIds: selectedTagIds,
        attachments,
        isPinned,
        isFavorite,
      });
      setSavedId(note.id);
    }
    setIsDirty(false);
    navigation.goBack();
  }, [title, body, selectedTagIds, attachments, isPinned, isFavorite, savedId]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Note",
      "This note will be permanently deleted. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (savedId) deleteNote(savedId);
            navigation.goBack();
          },
        },
      ]
    );
  }, [savedId, deleteNote, navigation]);

  const handlePin = useCallback(() => {
    setIsPinned((v) => !v);
    if (savedId) togglePin(savedId);
    markDirty();
  }, [savedId, togglePin, markDirty]);

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
    markDirty();
  };

  const removeAttachment = (attachId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachId));
    markDirty();
  };

  // Warn on unsaved changes (back press)
  const handleBack = useCallback(() => {
    if (isDirty) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Do you want to save before leaving?",
        [
          { text: "Discard", style: "destructive", onPress: () => navigation.goBack() },
          { text: "Save", onPress: handleSave },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [isDirty, handleSave, navigation]);

  // Insert markdown helpers
  const insertMarkdown = (prefix: string, suffix = "") => {
    const newBody = body + prefix + suffix;
    setBody(newBody);
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
        {/* Header */}
        <Header
          title={existingNote ? "Edit Note" : "New Note"}
          showBack
          onBack={handleBack}
          right={
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handlePin}
                style={[styles.headerBtn, isPinned && { backgroundColor: theme.colors.accentSubtle }]}
              >
                <Icon name={isPinned ? "pin" : "pin-outline"} size={18} color={isPinned ? theme.colors.accent : theme.colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setIsFavorite((v) => !v); markDirty(); }}
                style={styles.headerBtn}
              >
                <Icon
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={18}
                  color={isFavorite ? "#EC407A" : theme.colors.textMuted}
                />
              </TouchableOpacity>
              {existingNote && (
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
        >
          {/* Title */}
          <TextInput
            style={[styles.titleInput, { color: theme.colors.text }]}
            value={title}
            onChangeText={(t) => { setTitle(t); markDirty(); }}
            placeholder="Note title..."
            placeholderTextColor={theme.colors.textSubtle}
            multiline
            numberOfLines={2}
            maxLength={200}
            returnKeyType="next"
            onSubmitEditing={() => bodyRef.current?.focus()}
          />

          <Divider style={styles.divider} />

          {/* Body */}
          <TextInput
            ref={bodyRef}
            style={[styles.bodyInput, { color: theme.colors.text }]}
            value={body}
            onChangeText={(t) => { setBody(t); markDirty(); }}
            placeholder="Start writing..."
            placeholderTextColor={theme.colors.textSubtle}
            multiline
            textAlignVertical="top"
          />

          {/* Attachments strip */}
          {attachments.length > 0 && (
            <View style={styles.attachmentsSection}>
              <Text variant="captionStrong" color="textMuted" style={styles.sectionLabel}>
                ATTACHMENTS ({attachments.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbsRow}>
                {attachments.map((a) => (
                  <AttachmentThumbnail key={a.id} attachment={a} onRemove={() => removeAttachment(a.id)} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Tags section */}
          <View style={styles.tagsSection}>
            <Text variant="captionStrong" color="textMuted" style={styles.sectionLabel}>TAGS</Text>
            <View style={styles.tagsWrap}>
              {tags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);
                return (
                  <TouchableOpacity
                    key={tag.id}
                    onPress={() => toggleTag(tag.id)}
                    style={[
                      styles.tagChip,
                      {
                        backgroundColor: selected ? `${tag.color}25` : theme.colors.surface,
                        borderColor: selected ? tag.color : theme.colors.border,
                      },
                    ]}
                  >
                    <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                    <Text variant="caption" style={{ color: selected ? tag.color : theme.colors.textMuted }}>
                      {tag.name}
                    </Text>
                    {selected && <Icon name="checkmark" size={12} color={tag.color} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Stats */}
          <Text variant="caption" color="textSubtle" style={styles.wordCount}>
            {wordCount} word{wordCount !== 1 ? "s" : ""} · Last edited{" "}
            {existingNote
              ? new Date(existingNote.updatedAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "now"}
          </Text>
        </ScrollView>

        {/* Formatting Toolbar */}
        <View style={[styles.toolbar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <ToolbarBtn icon="text-outline" onPress={() => insertMarkdown("## ")} />
          <ToolbarBtn icon="list-outline" onPress={() => insertMarkdown("\n- ")} />
          <ToolbarBtn icon="checkmark-square-outline" onPress={() => insertMarkdown("\n- [ ] ")} />
          <ToolbarBtn icon="code-slash-outline" onPress={() => insertMarkdown("`", "`")} />
          <View style={styles.toolbarSep} />
          <ToolbarBtn icon="attach-outline" onPress={() => setShowAttachmentPicker(true)} />
          <View style={{ flex: 1 }} />
          <Button
            label="Save"
            variant="primary"
            size="sm"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </View>

        {/* Attachment Picker Sheet */}
        <AttachmentPicker
          visible={showAttachmentPicker}
          onClose={() => setShowAttachmentPicker(false)}
          onPickImage={() => {
            const stub: NoteAttachment = {
              id: `att-${Date.now()}`,
              type: "image",
              name: "photo.jpg",
              uri: "",
              sizeBytes: 0,
            };
            setAttachments((prev) => [...prev, stub]);
            markDirty();
          }}
          onPickPdf={() => {
            const stub: NoteAttachment = {
              id: `att-${Date.now()}`,
              type: "pdf",
              name: "document.pdf",
              uri: "",
              sizeBytes: 0,
            };
            setAttachments((prev) => [...prev, stub]);
            markDirty();
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    letterSpacing: -0.3,
    minHeight: 40,
  },
  divider: {
    marginVertical: 12,
  },
  bodyInput: {
    fontSize: 15,
    lineHeight: 24,
    minHeight: 200,
  },
  attachmentsSection: {
    marginTop: 20,
    gap: 8,
  },
  sectionLabel: {
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  thumbsRow: {
    gap: 10,
    paddingRight: 8,
  },
  thumbContainer: {
    width: 80,
    borderRadius: 10,
    borderWidth: 1,
    padding: 6,
    alignItems: "center",
    gap: 4,
    position: "relative",
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbName: {
    fontSize: 10,
    textAlign: "center",
    width: "100%",
  },
  thumbRemove: {
    position: "absolute",
    top: -6,
    right: -6,
  },
  tagsSection: {
    marginTop: 20,
    gap: 8,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    gap: 5,
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  wordCount: {
    marginTop: 24,
    textAlign: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  toolbarBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarSep: {
    width: StyleSheet.hairlineWidth,
    height: 20,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  saveBtn: {
    marginLeft: 4,
  },
});

export default NoteEditorScreen;
