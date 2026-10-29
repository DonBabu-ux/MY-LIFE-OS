/**
 * Notes Zustand store (mock, in-memory)
 */

import { create } from "zustand";
import {
  mockNotes,
  mockTags,
  mockFolders,
  type Note,
  type NoteTag,
  type NoteFolder,
} from "../mock";

interface NotesState {
  notes: Note[];
  tags: NoteTag[];
  folders: NoteFolder[];

  // Actions
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Note;
  updateNote: (id: string, changes: Partial<Omit<Note, "id" | "createdAt">>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;

  addTag: (tag: Omit<NoteTag, "id">) => void;
  updateTag: (id: string, changes: Partial<Omit<NoteTag, "id">>) => void;
  deleteTag: (id: string) => void;

  // Selectors
  getNoteById: (id: string) => Note | undefined;
  getTagById: (id: string) => NoteTag | undefined;
  getFolderById: (id: string) => NoteFolder | undefined;
}

let _noteCounter = 100;

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: mockNotes,
  tags: mockTags,
  folders: mockFolders,

  addNote: (note) => {
    const id = `note-${++_noteCounter}`;
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id,
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({ notes: [newNote, ...s.notes] }));
    return newNote;
  },

  updateNote: (id, changes) => {
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n
      ),
    }));
  },

  deleteNote: (id) => {
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
  },

  togglePin: (id) => {
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id
          ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() }
          : n
      ),
    }));
  },

  toggleFavorite: (id) => {
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id
          ? { ...n, isFavorite: !n.isFavorite, updatedAt: new Date().toISOString() }
          : n
      ),
    }));
  },

  addTag: (tag) => {
    const id = `tag-${Date.now()}`;
    set((s) => ({ tags: [...s.tags, { ...tag, id }] }));
  },

  updateTag: (id, changes) => {
    set((s) => ({
      tags: s.tags.map((t) => (t.id === id ? { ...t, ...changes } : t)),
    }));
  },

  deleteTag: (id) => {
    set((s) => ({
      tags: s.tags.filter((t) => t.id !== id),
      // Remove tag from all notes
      notes: s.notes.map((n) => ({
        ...n,
        tagIds: n.tagIds.filter((tid) => tid !== id),
      })),
    }));
  },

  getNoteById: (id) => get().notes.find((n) => n.id === id),
  getTagById: (id) => get().tags.find((t) => t.id === id),
  getFolderById: (id) => get().folders.find((f) => f.id === id),
}));
