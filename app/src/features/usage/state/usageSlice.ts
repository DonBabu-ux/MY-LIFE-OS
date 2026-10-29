/**
 * Phone Usage Zustand Store (mock, in-memory)
 */

import { create } from "zustand";
import {
  mockApps,
  mockFocusRules,
  mockUsageOverview,
  APP_CATEGORIES,
  type AppUsageItem,
  type FocusRule,
  type AppCategory,
} from "../mock";

interface CategoryStat {
  category: AppCategory;
  minutes: number;
  percentage: number;
  color: string;
  label: string;
  icon: string;
}

interface UsageState {
  apps: AppUsageItem[];
  focusRules: FocusRule[];
  pickupsToday: number;
  notificationsToday: number;

  // Actions
  updateAppCategory: (appId: string, category: AppCategory) => void;
  addFocusRule: (rule: Omit<FocusRule, "id">) => string;
  updateFocusRule: (ruleId: string, updates: Partial<FocusRule>) => void;
  deleteFocusRule: (ruleId: string) => void;
  toggleFocusRule: (ruleId: string) => void;

  // Selectors
  getAppById: (id: string) => AppUsageItem | undefined;
  getFocusRuleByAppId: (appId: string) => FocusRule | undefined;
  getTopApps: (limit?: number) => AppUsageItem[];
  getTodayTotalMinutes: () => number;
  getYesterdayTotalMinutes: () => number;
  getWeeklyTrend: () => number[];
  getCategoryBreakdown: () => CategoryStat[];
}

export const useUsageStore = create<UsageState>((set, get) => ({
  apps: mockApps,
  focusRules: mockFocusRules,
  pickupsToday: mockUsageOverview.pickupsToday,
  notificationsToday: mockUsageOverview.notificationsToday,

  updateAppCategory: (appId, category) => {
    set((state) => ({
      apps: state.apps.map((a) => (a.id === appId ? { ...a, category } : a)),
    }));
  },

  addFocusRule: (ruleData) => {
    const id = `rule_${Date.now()}`;
    const newRule: FocusRule = { ...ruleData, id };
    set((state) => ({
      focusRules: [newRule, ...state.focusRules],
    }));
    return id;
  },

  updateFocusRule: (ruleId, updates) => {
    set((state) => ({
      focusRules: state.focusRules.map((r) =>
        r.id === ruleId ? { ...r, ...updates } : r
      ),
    }));
  },

  deleteFocusRule: (ruleId) => {
    set((state) => ({
      focusRules: state.focusRules.filter((r) => r.id !== ruleId),
    }));
  },

  toggleFocusRule: (ruleId) => {
    set((state) => ({
      focusRules: state.focusRules.map((r) =>
        r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r
      ),
    }));
  },

  getAppById: (id) => {
    return get().apps.find((a) => a.id === id);
  },

  getFocusRuleByAppId: (appId) => {
    return get().focusRules.find((r) => r.appId === appId);
  },

  getTopApps: (limit = 5) => {
    return [...get().apps]
      .sort((a, b) => b.todayMinutes - a.todayMinutes)
      .slice(0, limit);
  },

  getTodayTotalMinutes: () => {
    return get().apps.reduce((sum, a) => sum + a.todayMinutes, 0);
  },

  getYesterdayTotalMinutes: () => {
    return get().apps.reduce((sum, a) => sum + a.yesterdayMinutes, 0);
  },

  getWeeklyTrend: () => {
    const daysCount = 7;
    const totals = new Array(daysCount).fill(0);
    const apps = get().apps;
    for (const app of apps) {
      if (app.weeklyMinutes && app.weeklyMinutes.length === daysCount) {
        for (let i = 0; i < daysCount; i++) {
          totals[i] += app.weeklyMinutes[i];
        }
      }
    }
    return totals;
  },

  getCategoryBreakdown: () => {
    const apps = get().apps;
    const totalsByCategory: Record<AppCategory, number> = {
      social: 0,
      productivity: 0,
      entertainment: 0,
      communication: 0,
      utilities: 0,
      finance: 0,
      health: 0,
      other: 0,
    };

    let total = 0;
    for (const app of apps) {
      totalsByCategory[app.category] =
        (totalsByCategory[app.category] || 0) + app.todayMinutes;
      total += app.todayMinutes;
    }

    if (total === 0) total = 1;

    const list: CategoryStat[] = [];
    (Object.keys(totalsByCategory) as AppCategory[]).forEach((cat) => {
      const minutes = totalsByCategory[cat];
      if (minutes > 0) {
        const cfg = APP_CATEGORIES[cat];
        list.push({
          category: cat,
          minutes,
          percentage: Math.round((minutes / total) * 100),
          color: cfg.color,
          label: cfg.label,
          icon: cfg.icon,
        });
      }
    });

    return list.sort((a, b) => b.minutes - a.minutes);
  },
}));
