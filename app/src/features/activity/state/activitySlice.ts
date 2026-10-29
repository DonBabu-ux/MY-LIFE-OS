/**
 * Activity Zustand store (mock, in-memory)
 */

import { create } from "zustand";
import {
  mockTodayActivity,
  mockWeeklyActivity,
  mockActivityHistory,
  mockWorkouts,
  type ActivityToday,
  type ActivityDay,
  type WorkoutItem,
} from "../mock";

interface ActivityState {
  today: ActivityToday;
  weekly: ActivityDay[];
  history: ActivityDay[];
  workouts: WorkoutItem[];
  isLocationEnabled: boolean;

  // Actions
  toggleLocation: (val?: boolean) => void;
  updateStepsTarget: (target: number) => void;
  addWorkout: (item: Omit<WorkoutItem, "id">) => void;
  getWeeklyAverageSteps: () => number;
  getDaysGoalReachedThisMonth: () => number;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  today: mockTodayActivity,
  weekly: mockWeeklyActivity,
  history: mockActivityHistory,
  workouts: mockWorkouts,
  isLocationEnabled: true,

  toggleLocation: (val) => {
    set((state) => ({
      isLocationEnabled: typeof val === "boolean" ? val : !state.isLocationEnabled,
    }));
  },

  updateStepsTarget: (target) => {
    set((state) => ({
      today: { ...state.today, stepsTarget: target },
    }));
  },

  addWorkout: (item) => {
    const newWorkout: WorkoutItem = {
      ...item,
      id: `workout_${Date.now()}`,
    };
    set((state) => ({
      workouts: [newWorkout, ...state.workouts],
    }));
  },

  getWeeklyAverageSteps: () => {
    const weekly = get().weekly;
    if (weekly.length === 0) return 0;
    const total = weekly.reduce((sum, d) => sum + d.steps, 0);
    return Math.round(total / weekly.length);
  },

  getDaysGoalReachedThisMonth: () => {
    return get().history.filter((d) => d.goalAchieved).length;
  },
}));
