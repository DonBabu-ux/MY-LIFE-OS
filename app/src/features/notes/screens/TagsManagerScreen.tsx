/**
 * TagsManagerScreen — Create, rename, delete, color-assign tags for notes.
 * Batch 6.3
 */

import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
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
  Button,
  EmptyState,
  Divider,
} from "../../../components";
import { useNotesStore } from "../state/notesSlice";
import type { NoteTag } from "../mock";

// ---------------------------------------------------------------------------
// Preset colors for tag creation
// ---------------------------------------------------------------------------
const PRESET_COLORS = [
  "#4F8EF7",
  "#AB47BC",
  "#66BB6A",
  "#FF7043",
  "#EC407A",
  "#26A69A",
  "#FFA726",
  "#29B6F6",
  "#78909C",
  "#EF5350",
  "#8D6E63",
  "#5C6BC0",
];

// ---------------------------------------------------------------------------
// TagEditModal — inline modal for creating/editing a tag
// ---------------------------------------------------------------------------
interface TagEditModalProps {
  visible: boolean;
  tag?: NoteTag;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

const TagEditModal: React.FC<TagEditModalProps> = ({ visible, tag, onClose, onSave }) => {
  const theme = useTheme();
  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState(tag?.color ?? PRESET_COLORS[0]);

  // Reset when opening
  React.useEffect(() => {
    if (visible) {
      setName(tag?.name ?? "");
      setColor(tag?.color ?? PRESET_COLORS[0]);
    }
  }, [visible, tag]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Required", "Tag name cannot be empty.");
      return;
    }
    onSave(name.trim(), color);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Card
          padding="lg"
          style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="h3" style={styles.modalTitle}>
            {tag ? "Edit Tag" : "New Tag"}
          </Text>

          <Text variant="captionStrong" color="textMuted" style={styles.fieldLabel}>
            NAME
          </Text>
          <TextInput
            style={[
              styles.nameInput,
              {
                color: theme.colors.text,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.bg,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Tag name..."
            placeholderTextColor={theme.colors.textSubtle}
            autoFocus
            maxLength={30}
          />

          <Text variant="captionStrong" color="textMuted" style={[styles.fieldLabel, { marginTop: 16 }]}>
            COLOR
          </Text>

          {/* Preview */}
          <View style={styles.previewRow}>
            <View style={[styles.tagPreview, { backgroundColor: `${color}25`, borderColor: color }]}>
              <View style={[styles.tagDot, { backgroundColor: color }]} />
              <Text variant="caption" style={{ color }}>{name || "Preview"}</Text>
            </View>
          </View>

          {/* Color grid */}
          <View style={styles.colorGrid}>
            {PRESET_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c },
                  color === c && styles.selectedSwatch,
                ]}
              >
                {color === c && <Icon name="checkmark" size={14} color="#fff" />}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalActions}>
            <Button label="Cancel" variant="ghost" onPress={onClose} style={styles.modalBtn} />
            <Button label="Save" variant="primary" onPress={handleSave} style={styles.modalBtn} />
          </View>
        </Card>
      </View>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// TagRow
// ---------------------------------------------------------------------------
const TagRow: React.FC<{
  tag: NoteTag;
  noteCount: number;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ tag, noteCount, onEdit, onDelete }) => {
  const theme = useTheme();
  return (
    <View style={styles.tagRow}>
      <View style={[styles.tagColorBar, { backgroundColor: tag.color }]} />
      <View style={[styles.tagDotLarge, { backgroundColor: `${tag.color}25` }]}>
        <View style={[styles.tagDotInner, { backgroundColor: tag.color }]} />
      </View>
      <View style={styles.tagInfo}>
        <Text variant="bodyStrong">{tag.name}</Text>
        <Text variant="caption" color="textMuted">
          {noteCount} note{noteCount !== 1 ? "s" : ""}
        </Text>
      </View>
      <View style={styles.tagActions}>
        <TouchableOpacity
          onPress={onEdit}
          style={[styles.actionBtn, { backgroundColor: theme.colors.surface }]}
        >
          <Icon name="pencil-outline" size={16} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          style={[styles.actionBtn, { backgroundColor: theme.colors.dangerSubtle ?? "#fee" }]}
        >
          <Icon name="trash-outline" size={16} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export const TagsManagerScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const tags = useNotesStore((s) => s.tags);
  const notes = useNotesStore((s) => s.notes);
  const addTag = useNotesStore((s) => s.addTag);
  const updateTag = useNotesStore((s) => s.updateTag);
  const deleteTag = useNotesStore((s) => s.deleteTag);

  const [editingTag, setEditingTag] = useState<NoteTag | undefined>();
  const [showModal, setShowModal] = useState(false);

  const getNoteCountForTag = (tagId: string) =>
    notes.filter((n) => n.tagIds.includes(tagId)).length;

  const handleCreate = () => {
    setEditingTag(undefined);
    setShowModal(true);
  };

  const handleEdit = (tag: NoteTag) => {
    setEditingTag(tag);
    setShowModal(true);
  };

  const handleSave = (name: string, color: string) => {
    if (editingTag) {
      updateTag(editingTag.id, { name, color });
    } else {
      addTag({ name, color });
    }
  };

  const handleDelete = (tag: NoteTag) => {
    const count = getNoteCountForTag(tag.id);
    Alert.alert(
      "Delete Tag",
      count > 0
        ? `"${tag.name}" is used in ${count} note${count !== 1 ? "s" : ""}. Deleting it will remove it from those notes.`
        : `Delete the tag "${tag.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTag(tag.id),
        },
      ]
    );
  };

  return (
    <Screen>
      <Header
        title="Manage Tags"
        showBack
        right={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCreate}
            style={[styles.headerAddBtn, { backgroundColor: theme.colors.accent }]}
          >
            <Icon name="add" size={20} color={theme.colors.onAccent} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={tags}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text variant="body" color="textMuted">
              Tags help you find related notes quickly across folders.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Icon name="pricetags-outline" size={48} color={theme.colors.textMuted} />}
            title="No Tags Yet"
            description="Create tags to categorize your notes."
            action={<Button label="Create Tag" variant="primary" onPress={handleCreate} />}
          />
        }
        ItemSeparatorComponent={() => (
          <Divider style={{ marginHorizontal: 16 }} />
        )}
        renderItem={({ item }) => (
          <TagRow
            tag={item}
            noteCount={getNoteCountForTag(item.id)}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
      />

      {/* FAB for small screens */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleCreate}
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
      >
        <Icon name="add" size={28} color={theme.colors.onAccent} />
      </TouchableOpacity>

      <TagEditModal
        visible={showModal}
        tag={editingTag}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 90,
  },
  headerAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  tagColorBar: {
    width: 3,
    height: 36,
    borderRadius: 2,
  },
  tagDotLarge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tagDotInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  tagInfo: {
    flex: 1,
    gap: 2,
  },
  tagActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 20,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  fieldLabel: {
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  nameInput: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  previewRow: {
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tagPreview: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  colorSwatch: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedSwatch: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
  },
});

export default TagsManagerScreen;
