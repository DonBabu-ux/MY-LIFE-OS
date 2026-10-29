/**
 * Mock data for Planner feature (Batch 8)
 */

export type Priority = "low" | "medium" | "high" | "critical";
export type RecurrencePreset =
  | "none"
  | "daily"
  | "weekdays"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "custom";

export interface Reminder {
  id: string;
  minutesBefore: number; // e.g. 0=at time, 15, 30, 60, 1440
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  dueDate?: string;     // YYYY-MM-DD
  plannedStart?: string; // ISO datetime for day-view time-block
  plannedEnd?: string;   // ISO datetime
  recurrence: RecurrencePreset;
  reminders: Reminder[];
  isCompleted: boolean;
  completedAt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Priority config
// ---------------------------------------------------------------------------
export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; icon: string }
> = {
  low:      { label: "Low",      color: "#78909C", icon: "arrow-down-outline" },
  medium:   { label: "Medium",   color: "#FFA726", icon: "remove-outline" },
  high:     { label: "High",     color: "#FF7043", icon: "arrow-up-outline" },
  critical: { label: "Critical", color: "#EF5350", icon: "flame-outline" },
};

export const RECURRENCE_LABELS: Record<RecurrencePreset, string> = {
  none:     "Does not repeat",
  daily:    "Every day",
  weekdays: "Every weekday (Mon–Fri)",
  weekly:   "Every week",
  biweekly: "Every 2 weeks",
  monthly:  "Every month",
  custom:   "Custom…",
};

export const REMINDER_OPTIONS = [
  { label: "At time of task", value: 0 },
  { label: "5 minutes before", value: 5 },
  { label: "15 minutes before", value: 15 },
  { label: "30 minutes before", value: 30 },
  { label: "1 hour before", value: 60 },
  { label: "2 hours before", value: 120 },
  { label: "1 day before", value: 1440 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const todayISO = () => new Date().toISOString().slice(0, 10);

const daysFromNow = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const timeBlock = (dayOffset: number, startHour: number, durationHrs: number) => {
  const start = new Date();
  start.setDate(start.getDate() + dayOffset);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(start);
  end.setHours(startHour + durationHrs, 0, 0, 0);
  return { plannedStart: start.toISOString(), plannedEnd: end.toISOString() };
};

const now = new Date().toISOString();

// ---------------------------------------------------------------------------
// Mock tasks
// ---------------------------------------------------------------------------
export const mockTasks: Task[] = [
  // ---- TODAY ----
  {
    id: "task-1",
    title: "Deep work: design system refactor",
    notes: "Focus on spacing tokens and variant API cleanup.",
    priority: "high",
    dueDate: todayISO(),
    ...timeBlock(0, 9, 3),
    recurrence: "none",
    reminders: [{ id: "rem-1", minutesBefore: 15 }],
    isCompleted: true,
    completedAt: new Date().toISOString(),
    tags: ["work", "dev"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-2",
    title: "Team stand-up call",
    notes: "Share progress on dashboard sprint.",
    priority: "medium",
    dueDate: todayISO(),
    ...timeBlock(0, 10, 1),
    recurrence: "weekdays",
    reminders: [{ id: "rem-2", minutesBefore: 5 }],
    isCompleted: true,
    completedAt: new Date().toISOString(),
    tags: ["work"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-3",
    title: "Review client feedback doc",
    priority: "high",
    dueDate: todayISO(),
    ...timeBlock(0, 14, 1),
    recurrence: "none",
    reminders: [],
    isCompleted: false,
    tags: ["work", "client"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-4",
    title: "30-minute gym session",
    priority: "medium",
    dueDate: todayISO(),
    ...timeBlock(0, 18, 1),
    recurrence: "daily",
    reminders: [{ id: "rem-3", minutesBefore: 30 }],
    isCompleted: false,
    tags: ["fitness"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-5",
    title: "Read 30 pages of Atomic Habits",
    priority: "low",
    dueDate: todayISO(),
    ...timeBlock(0, 21, 1),
    recurrence: "daily",
    reminders: [],
    isCompleted: false,
    tags: ["personal", "learning"],
    createdAt: now,
    updatedAt: now,
  },

  // ---- OVERDUE ----
  {
    id: "task-6",
    title: "Send invoice to Acme Design Lab",
    notes: "Invoice #INV-2026-047 for sprint milestone.",
    priority: "critical",
    dueDate: daysFromNow(-2),
    recurrence: "none",
    reminders: [{ id: "rem-4", minutesBefore: 60 }],
    isCompleted: false,
    tags: ["finance", "client"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-7",
    title: "Schedule car service appointment",
    priority: "medium",
    dueDate: daysFromNow(-4),
    recurrence: "none",
    reminders: [],
    isCompleted: false,
    tags: ["personal"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-8",
    title: "File monthly expense report",
    priority: "high",
    dueDate: daysFromNow(-1),
    recurrence: "monthly",
    reminders: [{ id: "rem-5", minutesBefore: 1440 }],
    isCompleted: false,
    tags: ["finance", "work"],
    createdAt: now,
    updatedAt: now,
  },

  // ---- TOMORROW ----
  {
    id: "task-9",
    title: "Client presentation prep",
    notes: "Finalize deck slides. Run through timing — should be under 20 mins.",
    priority: "high",
    dueDate: daysFromNow(1),
    ...timeBlock(1, 10, 2),
    recurrence: "none",
    reminders: [{ id: "rem-6", minutesBefore: 60 }],
    isCompleted: false,
    tags: ["work", "client"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-10",
    title: "Grocery run — weekly essentials",
    priority: "medium",
    dueDate: daysFromNow(1),
    recurrence: "weekly",
    reminders: [],
    isCompleted: false,
    tags: ["personal"],
    createdAt: now,
    updatedAt: now,
  },

  // ---- NEXT 7 DAYS ----
  {
    id: "task-11",
    title: "Portfolio quarterly review",
    notes: "Check NSE ETF, T-bills, SACCO. Rebalance if needed.",
    priority: "high",
    dueDate: daysFromNow(3),
    recurrence: "none",
    reminders: [{ id: "rem-7", minutesBefore: 1440 }],
    isCompleted: false,
    tags: ["finance"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-12",
    title: "Write blog post draft",
    notes: "Topic: 'Why I track every shilling I spend'.",
    priority: "medium",
    dueDate: daysFromNow(4),
    recurrence: "none",
    reminders: [],
    isCompleted: false,
    tags: ["personal", "writing"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-13",
    title: "Dentist appointment",
    priority: "medium",
    dueDate: daysFromNow(5),
    ...timeBlock(5, 11, 1),
    recurrence: "none",
    reminders: [{ id: "rem-8", minutesBefore: 60 }],
    isCompleted: false,
    tags: ["health"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-14",
    title: "Call Mum",
    priority: "high",
    dueDate: daysFromNow(6),
    recurrence: "weekly",
    reminders: [{ id: "rem-9", minutesBefore: 30 }],
    isCompleted: false,
    tags: ["family"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-15",
    title: "Pay electricity bill — KPLC",
    priority: "critical",
    dueDate: daysFromNow(7),
    recurrence: "monthly",
    reminders: [{ id: "rem-10", minutesBefore: 1440 }],
    isCompleted: false,
    tags: ["finance"],
    createdAt: now,
    updatedAt: now,
  },

  // ---- RECENTLY COMPLETED ----
  {
    id: "task-16",
    title: "Set up automated savings transfer",
    priority: "high",
    dueDate: daysFromNow(-3),
    recurrence: "none",
    reminders: [],
    isCompleted: true,
    completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    tags: ["finance"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-17",
    title: "Publish MyLifeOS design spec",
    priority: "high",
    dueDate: daysFromNow(-5),
    recurrence: "none",
    reminders: [],
    isCompleted: true,
    completedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    tags: ["work"],
    createdAt: now,
    updatedAt: now,
  },
];
