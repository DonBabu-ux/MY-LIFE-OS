/**
 * Planner Zustand store (mock, in-memory)
 */

import { create } from "zustand";
import { mockTasks, type Task, type Priority, type RecurrencePreset, type Reminder } from "../mock";

interface PlannerState {
  tasks: Task[];

  // Actions
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task;
  updateTask: (id: string, changes: Partial<Omit<Task, "id" | "createdAt">>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;

  // Selectors
  getTaskById: (id: string) => Task | undefined;
  getTasksForDate: (dateStr: string) => Task[];
  getOverdueTasks: () => Task[];
  getUpcomingTasks: (daysAhead?: number) => Task[];
  getCompletedTasks: () => Task[];
  getTodayTasks: () => Task[];
}

let _counter = 300;

const todayStr = () => new Date().toISOString().slice(0, 10);

export const usePlannerStore = create<PlannerState>((set, get) => ({
  tasks: mockTasks,

  addTask: (task) => {
    const id = `task-${++_counter}`;
    const now = new Date().toISOString();
    const newTask: Task = { ...task, id, createdAt: now, updatedAt: now };
    set((s) => ({ tasks: [newTask, ...s.tasks] }));
    return newTask;
  },

  updateTask: (id, changes) => {
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, ...changes, updatedAt: new Date().toISOString() } : t
      ),
    }));
  },

  deleteTask: (id) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },

  toggleComplete: (id) => {
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id !== id) return t;
        const now = new Date().toISOString();
        return {
          ...t,
          isCompleted: !t.isCompleted,
          completedAt: !t.isCompleted ? now : undefined,
          updatedAt: now,
        };
      }),
    }));
  },

  getTaskById: (id) => get().tasks.find((t) => t.id === id),

  getTasksForDate: (dateStr) =>
    get().tasks.filter((t) => t.dueDate === dateStr && !t.isCompleted),

  getOverdueTasks: () => {
    const today = todayStr();
    return get().tasks.filter(
      (t) => !t.isCompleted && t.dueDate && t.dueDate < today
    ).sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
  },

  getTodayTasks: () => {
    const today = todayStr();
    return get().tasks.filter((t) => t.dueDate === today);
  },

  getUpcomingTasks: (daysAhead = 7) => {
    const today = todayStr();
    const limit = new Date();
    limit.setDate(limit.getDate() + daysAhead);
    const limitStr = limit.toISOString().slice(0, 10);
    return get().tasks.filter(
      (t) =>
        !t.isCompleted &&
        t.dueDate &&
        t.dueDate > today &&
        t.dueDate <= limitStr
    ).sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
  },

  getCompletedTasks: () =>
    get().tasks
      .filter((t) => t.isCompleted)
      .sort((a, b) =>
        (b.completedAt ?? "").localeCompare(a.completedAt ?? "")
      ),
}));
