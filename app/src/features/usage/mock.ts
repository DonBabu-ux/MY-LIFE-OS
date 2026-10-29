/**
 * Mock data for Phone Usage feature (Batch 9)
 */

export type AppCategory =
  | "social"
  | "productivity"
  | "entertainment"
  | "communication"
  | "utilities"
  | "finance"
  | "health"
  | "other";

export interface CategoryConfig {
  key: AppCategory;
  label: string;
  icon: string;
  color: string;
}

export const APP_CATEGORIES: Record<AppCategory, CategoryConfig> = {
  social: { key: "social", label: "Social", icon: "share-2", color: "#EC4899" },
  productivity: { key: "productivity", label: "Productivity", icon: "check-circle", color: "#3B82F6" },
  entertainment: { key: "entertainment", label: "Entertainment", icon: "play-circle", color: "#8B5CF6" },
  communication: { key: "communication", label: "Communication", icon: "message-circle", color: "#10B981" },
  utilities: { key: "utilities", label: "Utilities", icon: "tool", color: "#64748B" },
  finance: { key: "finance", label: "Finance", icon: "dollar-sign", color: "#F59E0B" },
  health: { key: "health", label: "Health & Fitness", icon: "heart", color: "#EF4444" },
  other: { key: "other", label: "Other", icon: "grid", color: "#94A3B8" },
};

export interface AppUsageItem {
  id: string;
  name: string;
  icon: string;
  category: AppCategory;
  todayMinutes: number;
  yesterdayMinutes: number;
  launchCountToday: number;
  notificationCountToday: number;
  weeklyMinutes: number[]; // 7 days: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  hourlyMinutes: number[]; // 24 hours: 0..23
  color: string;
}

export interface FocusRule {
  id: string;
  appId: string;
  appName: string;
  appIcon: string;
  allowedMinutes: number;
  activeHours: { start: string; end: string };
  days: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri"]
  isEnabled: boolean;
  action: "block" | "warn" | "grayscale";
}

export const mockApps: AppUsageItem[] = [
  {
    id: "app_instagram",
    name: "Instagram",
    icon: "camera",
    category: "social",
    todayMinutes: 78,
    yesterdayMinutes: 94,
    launchCountToday: 24,
    notificationCountToday: 42,
    weeklyMinutes: [65, 82, 90, 78, 94, 110, 85],
    hourlyMinutes: [0, 0, 0, 0, 0, 0, 5, 12, 10, 4, 8, 15, 6, 4, 2, 0, 4, 12, 18, 22, 14, 8, 2, 0],
    color: "#E1306C",
  },
  {
    id: "app_youtube",
    name: "YouTube",
    icon: "play",
    category: "entertainment",
    todayMinutes: 62,
    yesterdayMinutes: 80,
    launchCountToday: 9,
    notificationCountToday: 15,
    weeklyMinutes: [45, 55, 70, 62, 80, 120, 95],
    hourlyMinutes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 20, 10, 0, 0, 5, 0, 10, 25, 30, 12, 5, 0, 0],
    color: "#FF0000",
  },
  {
    id: "app_slack",
    name: "Slack",
    icon: "message-square",
    category: "communication",
    todayMinutes: 48,
    yesterdayMinutes: 52,
    launchCountToday: 38,
    notificationCountToday: 64,
    weeklyMinutes: [50, 55, 60, 48, 52, 10, 5],
    hourlyMinutes: [0, 0, 0, 0, 0, 0, 0, 2, 8, 14, 12, 6, 8, 10, 12, 8, 6, 4, 0, 0, 0, 0, 0, 0],
    color: "#4A154B",
  },
  {
    id: "app_notion",
    name: "Notion",
    icon: "file-text",
    category: "productivity",
    todayMinutes: 35,
    yesterdayMinutes: 40,
    launchCountToday: 12,
    notificationCountToday: 6,
    weeklyMinutes: [30, 45, 40, 35, 40, 20, 15],
    hourlyMinutes: [0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 8, 0, 0, 5, 10, 0, 0, 0, 5, 0, 0, 0, 0, 0],
    color: "#2D3748",
  },
  {
    id: "app_whatsapp",
    name: "WhatsApp",
    icon: "phone-call",
    category: "communication",
    todayMinutes: 28,
    yesterdayMinutes: 34,
    launchCountToday: 31,
    notificationCountToday: 58,
    weeklyMinutes: [32, 29, 35, 28, 34, 45, 40],
    hourlyMinutes: [0, 0, 0, 0, 0, 0, 2, 4, 3, 5, 2, 4, 5, 3, 4, 3, 2, 5, 6, 4, 3, 2, 0, 0],
    color: "#25D366",
  },
  {
    id: "app_x",
    name: "X (Twitter)",
    icon: "twitter",
    category: "social",
    todayMinutes: 22,
    yesterdayMinutes: 38,
    launchCountToday: 14,
    notificationCountToday: 18,
    weeklyMinutes: [25, 30, 28, 22, 38, 45, 30],
    hourlyMinutes: [0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 5, 4, 0, 0, 2, 0, 4, 6, 8, 4, 0, 0, 0],
    color: "#1DA1F2",
  },
  {
    id: "app_spotify",
    name: "Spotify",
    icon: "music",
    category: "entertainment",
    todayMinutes: 18,
    yesterdayMinutes: 25,
    launchCountToday: 6,
    notificationCountToday: 4,
    weeklyMinutes: [20, 22, 25, 18, 25, 30, 28],
    hourlyMinutes: [0, 0, 0, 0, 0, 0, 0, 5, 4, 0, 0, 3, 2, 0, 0, 0, 0, 4, 2, 0, 0, 0, 0, 0],
    color: "#1DB954",
  },
  {
    id: "app_safari",
    name: "Browser",
    icon: "compass",
    category: "utilities",
    todayMinutes: 16,
    yesterdayMinutes: 20,
    launchCountToday: 11,
    notificationCountToday: 0,
    weeklyMinutes: [18, 15, 22, 16, 20, 25, 18],
    hourlyMinutes: [0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 0, 4, 2, 1, 2, 0, 0, 2, 3, 1, 0, 0, 0, 0],
    color: "#0284C7",
  },
  {
    id: "app_gmail",
    name: "Gmail",
    icon: "mail",
    category: "communication",
    todayMinutes: 14,
    yesterdayMinutes: 18,
    launchCountToday: 16,
    notificationCountToday: 32,
    weeklyMinutes: [16, 20, 18, 14, 18, 6, 4],
    hourlyMinutes: [0, 0, 0, 0, 0, 0, 0, 2, 4, 3, 1, 2, 1, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0],
    color: "#EA4335",
  },
  {
    id: "app_duolingo",
    name: "Duolingo",
    icon: "book-open",
    category: "productivity",
    todayMinutes: 11,
    yesterdayMinutes: 15,
    launchCountToday: 2,
    notificationCountToday: 3,
    weeklyMinutes: [15, 12, 14, 11, 15, 15, 12],
    hourlyMinutes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0],
    color: "#58CC02",
  },
];

export const mockFocusRules: FocusRule[] = [
  {
    id: "rule_instagram",
    appId: "app_instagram",
    appName: "Instagram",
    appIcon: "camera",
    allowedMinutes: 30,
    activeHours: { start: "09:00", end: "17:00" },
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    isEnabled: true,
    action: "block",
  },
  {
    id: "rule_youtube",
    appId: "app_youtube",
    appName: "YouTube",
    appIcon: "play",
    allowedMinutes: 45,
    activeHours: { start: "09:00", end: "18:00" },
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    isEnabled: true,
    action: "warn",
  },
  {
    id: "rule_x",
    appId: "app_x",
    appName: "X (Twitter)",
    appIcon: "twitter",
    allowedMinutes: 20,
    activeHours: { start: "08:00", end: "20:00" },
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    isEnabled: false,
    action: "block",
  },
];

export const mockUsageOverview = {
  todayTotalMinutes: 329,
  yesterdayTotalMinutes: 384,
  goalMinutes: 240,
  pickupsToday: 68,
  pickupsYesterday: 74,
  notificationsToday: 242,
  notificationsYesterday: 260,
  weeklyTrend: [310, 345, 380, 329, 384, 420, 350],
  dayLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

export const formatDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
