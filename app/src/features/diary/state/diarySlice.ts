/**
 * Diary Zustand store (mock, in-memory)
 */

import { create } from "zustand";
import { mockDiaryEntries, type DiaryEntry, type MoodLevel, type DiaryMedia } from "../mock";

interface DiaryState {
  entries: DiaryEntry[];

  // Actions
  addEntry: (entry: Omit<DiaryEntry, "id" | "createdAt" | "updatedAt">) => DiaryEntry;
  updateEntry: (id: string, changes: Partial<Omit<DiaryEntry, "id" | "createdAt">>) => void;
  deleteEntry: (id: string) => void;
  togglePrivate: (id: string) => void;

  // Selectors
  getEntryById: (id: string) => DiaryEntry | undefined;
  getEntriesForMonth: (year: number, month: number) => DiaryEntry[];
  getEntryForDate: (dateStr: string) => DiaryEntry | undefined;
  getMoodStreakDays: () => number;
}

let _counter = 200;

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: mockDiaryEntries,

  addEntry: (entry) => {
    const id = `de-${++_counter}`;
    const now = new Date().toISOString();
    const newEntry: DiaryEntry = { ...entry, id, createdAt: now, updatedAt: now };
    set((s) => ({ entries: [newEntry, ...s.entries] }));
    return newEntry;
  },

  updateEntry: (id, changes) => {
    set((s) => ({
      entries: s.entries.map((e) =>
        e.id === id ? { ...e, ...changes, updatedAt: new Date().toISOString() } : e
      ),
    }));
  },

  deleteEntry: (id) => {
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
  },

  togglePrivate: (id) => {
    set((s) => ({
      entries: s.entries.map((e) =>
        e.id === id ? { ...e, isPrivate: !e.isPrivate, updatedAt: new Date().toISOString() } : e
      ),
    }));
  },

  getEntryById: (id) => get().entries.find((e) => e.id === id),

  getEntriesForMonth: (year, month) => {
    return get().entries.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  },

  getEntryForDate: (dateStr) => get().entries.find((e) => e.date === dateStr),

  getMoodStreakDays: () => {
    const entries = get().entries;
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      if (entries.find((e) => e.date === dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  },
}));
