/**
 * NotesListScreen — folder sidebar + tag filters + search bar + FAB
 * Batch 6.1
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
  EmptyState,
  Button,
  Divider,
} from "../../../components";
import { Routes } from "../../../navigation/routes";
import { useNotesStore } from "../state/notesSlice";
import type { Note } from "../mock";

// ---------------------------------------------------------------------------
// Note Card
// ---------------------------------------------------------------------------
const NoteCard: React.FC<{
  note: Note;
  tagNames: string[];
  onPress: () => void;
  onToggleFavorite: () => void;
}> = ({ note, tagNames, onPress, onToggleFavorite }) => {
  const theme = useTheme();

  const preview = note.body
    .replace(/#+\s/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .trim()
    .slice(0, 120);

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
      <Card
        padding="md"
        style={[
          styles.noteCard,
          note.isPinned && { borderLeftWidth: 3, borderLeftColor: theme.colors.accent },
        ]}
      >
        {/* Header row */}
        <View style={styles.noteCardHeader}>
          <View style={styles.noteTitleRow}>
            {note.isPinned && (
              <Icon name="pin" size={13} color={theme.colors.accent} style={{ marginRight: 5 }} />
            )}
            <Text variant="bodyStrong" numberOfLines={1} style={styles.noteTitle}>
              {note.title}
            </Text>
          </View>
          <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon
              name={note.isFavorite ? "heart" : "heart-outline"}
              size={17}
              color={note.isFavorite ? "#EC407A" : theme.colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Preview */}
        {preview.length > 0 && (
          <Text variant="caption" color="textSubtle" numberOfLines={2} style={styles.notePreview}>
            {preview}
          </Text>
        )}

        {/* Footer: tags + time */}
        <View style={styles.noteCardFooter}>
          <View style={styles.tagsRow}>
            {tagNames.slice(0, 3).map((tag, i) => (
              <View
                key={i}
                style={[styles.tagBadge, { backgroundColor: theme.colors.accentSubtle }]}
              >
                <Text variant="caption" color="accent" style={styles.tagText}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
          <Text variant="caption" color="textMuted">
            {relativeTime(note.updatedAt)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Folder Sidebar Item
// ---------------------------------------------------------------------------
const FolderItem: React.FC<{
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  selected: boolean;
  onPress: () => void;
}> = ({ name, icon, color, count, selected, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.folderItem,
        selected && { backgroundColor: theme.colors.accentSubtle },
      ]}
    >
      <View style={[styles.folderIconWrap, { backgroundColor: `${color}25` }]}>
        <Icon name={icon} size={16} color={color} />
      </View>
      <Text
        variant="caption"
        color={selected ? "accent" : "textMuted"}
        numberOfLines={1}
        style={styles.folderName}
      >
        {name}
      </Text>
      {count > 0 && (
        <View
          style={[
            styles.folderBadge,
            { backgroundColor: selected ? theme.colors.accent : theme.colors.border },
          ]}
        >
          <Text
            variant="caption"
            style={{
              color: selected ? theme.colors.onAccent : theme.colors.textMuted,
              fontSize: 10,
            }}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export const NotesListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const notes = useNotesStore((s) => s.notes);
  const tags = useNotesStore((s) => s.tags);
  const folders = useNotesStore((s) => s.folders);
  const toggleFavorite = useNotesStore((s) => s.toggleFavorite);

  const [search, setSearch] = useState("");
  const [activeFolderId, setActiveFolderId] = useState<string>("folder-all");
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Folder filter
    if (activeFolderId !== "folder-all") {
      result = result.filter((n) => n.folderId === activeFolderId);
    }

    // Tag filter
    if (activeTagId) {
      result = result.filter((n) => n.tagIds.includes(activeTagId));
    }

    // Favorites filter
    if (showFavorites) {
      result = result.filter((n) => n.isFavorite);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q)
      );
    }

    // Pinned first, then by updatedAt desc
    return result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, activeFolderId, activeTagId, showFavorites, search]);

  const getTagNames = (tagIds: string[]) =>
    tagIds.map((id) => tags.find((t) => t.id === id)?.name ?? "").filter(Boolean);

  return (
    <View style={styles.root}>
      {/* Sidebar */}
      <View style={[styles.sidebar, { backgroundColor: theme.colors.surface, borderRightColor: theme.colors.border }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarContent}>
          <Text variant="caption" color="textMuted" style={styles.sidebarLabel}>FOLDERS</Text>
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              id={folder.id}
              name={folder.name}
              icon={folder.icon}
              color={folder.color}
              count={
                folder.id === "folder-all"
                  ? notes.length
                  : notes.filter((n) => n.folderId === folder.id).length
              }
              selected={activeFolderId === folder.id}
              onPress={() => setActiveFolderId(folder.id)}
            />
          ))}

          <Divider style={{ marginVertical: 8 }} />

          <Text variant="caption" color="textMuted" style={styles.sidebarLabel}>FILTERS</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowFavorites(!showFavorites)}
            style={[styles.folderItem, showFavorites && { backgroundColor: theme.colors.accentSubtle }]}
          >
            <View style={[styles.folderIconWrap, { backgroundColor: "#EC407A25" }]}>
              <Icon name="heart-outline" size={16} color="#EC407A" />
            </View>
            <Text variant="caption" color={showFavorites ? "accent" : "textMuted"} style={styles.folderName}>
              Favorites
            </Text>
            <View style={[styles.folderBadge, { backgroundColor: showFavorites ? theme.colors.accent : theme.colors.border }]}>
              <Text variant="caption" style={{ color: showFavorites ? theme.colors.onAccent : theme.colors.textMuted, fontSize: 10 }}>
                {notes.filter((n) => n.isFavorite).length}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main content */}
      <View style={styles.main}>
        <Screen style={styles.screen}>
          <Header
            title="Notes"
            subtitle={`${filteredNotes.length} note${filteredNotes.length !== 1 ? "s" : ""}`}
            right={
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate(Routes.TagsManager)}
                style={[styles.headerBtn, { backgroundColor: theme.colors.surface }]}
              >
                <Icon name="pricetags-outline" size={18} color={theme.colors.text} />
              </TouchableOpacity>
            }
          />

          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View
              style={[
                styles.searchBar,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <Icon name="search" size={16} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                placeholder="Search notes..."
                placeholderTextColor={theme.colors.textSubtle}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Icon name="close-circle" size={16} color={theme.colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Tag Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagChipsRow}
          >
            <TouchableOpacity
              onPress={() => setActiveTagId(null)}
              style={[
                styles.tagChip,
                {
                  backgroundColor: !activeTagId ? theme.colors.accentSubtle : theme.colors.surface,
                  borderColor: !activeTagId ? theme.colors.accent : theme.colors.border,
                },
              ]}
            >
              <Text variant="captionStrong" color={!activeTagId ? "accent" : "textMuted"}>All</Text>
            </TouchableOpacity>
            {tags.map((tag) => {
              const active = activeTagId === tag.id;
              return (
                <TouchableOpacity
                  key={tag.id}
                  onPress={() => setActiveTagId(active ? null : tag.id)}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: active ? `${tag.color}25` : theme.colors.surface,
                      borderColor: active ? tag.color : theme.colors.border,
                    },
                  ]}
                >
                  <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                  <Text
                    variant="captionStrong"
                    style={{ color: active ? tag.color : theme.colors.textMuted }}
                  >
                    {tag.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Notes List */}
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
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
                icon={<Icon name="document-text-outline" size={48} color={theme.colors.textMuted} />}
                title={search || activeTagId || showFavorites ? "No Notes Match" : "No Notes Yet"}
                description={
                  search || activeTagId || showFavorites
                    ? "Try adjusting your search or filters."
                    : "Create your first note to start capturing your thoughts."
                }
                action={
                  search || activeTagId || showFavorites ? (
                    <Button
                      label="Clear Filters"
                      variant="secondary"
                      onPress={() => { setSearch(""); setActiveTagId(null); setShowFavorites(false); }}
                    />
                  ) : (
                    <Button
                      label="New Note"
                      variant="primary"
                      onPress={() => navigation.navigate(Routes.NoteEditor, {})}
                    />
                  )
                }
              />
            }
            renderItem={({ item }) => (
              <NoteCard
                note={item}
                tagNames={getTagNames(item.tagIds)}
                onPress={() => navigation.navigate(Routes.NoteEditor, { id: item.id })}
                onToggleFavorite={() => toggleFavorite(item.id)}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          {/* FAB */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate(Routes.NoteEditor, {})}
            style={[styles.fab, { backgroundColor: theme.colors.accent }]}
          >
            <Icon name="add" size={28} color={theme.colors.onAccent} />
          </TouchableOpacity>
        </Screen>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 80,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  sidebarContent: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 6,
    gap: 4,
  },
  sidebarLabel: {
    fontSize: 9,
    paddingHorizontal: 4,
    marginBottom: 4,
    marginTop: 4,
  },
  folderItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    gap: 4,
  },
  folderIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  folderName: {
    fontSize: 10,
    textAlign: "center",
  },
  folderBadge: {
    minWidth: 18,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  main: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: "100%",
  },
  tagChipsRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
    alignItems: "center",
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    gap: 5,
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  separator: {
    height: 10,
  },
  noteCard: {
    borderRadius: 16,
    gap: 6,
  },
  noteCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  noteTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  noteTitle: {
    flex: 1,
  },
  notePreview: {
    lineHeight: 18,
  },
  noteCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 4,
  },
  tagsRow: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
    flexWrap: "wrap",
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
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
});

export default NotesListScreen;
