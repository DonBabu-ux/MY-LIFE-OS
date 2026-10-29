/**
 * App Settings & Security Zustand Store (mock, in-memory)
 * Batch 12
 */

import { create } from "zustand";

export interface SyncCategorySettings {
  money: boolean;
  vault: boolean;
  plan: boolean;
  usage: boolean;
  activity: boolean;
  contacts: boolean;
}

export interface PermissionSettings {
  sms: boolean;
  location: boolean;
  camera: boolean;
  notifications: boolean;
}

interface SettingsState {
  isOnboarded: boolean;
  pin: string;
  isBiometricEnabled: boolean;
  autoLockTimeout: "immediate" | "1min" | "5min" | "15min" | "never";
  themeMode: "system" | "dark" | "light";
  reducedMotion: boolean;
  syncCategories: SyncCategorySettings;
  permissions: PermissionSettings;
  lastBackupTime: string;

  // Actions
  completeOnboarding: (newPin: string) => void;
  setPin: (newPin: string) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  setAutoLockTimeout: (timeout: "immediate" | "1min" | "5min" | "15min" | "never") => void;
  setThemeMode: (mode: "system" | "dark" | "light") => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleSyncCategory: (category: keyof SyncCategorySettings) => void;
  togglePermission: (perm: keyof PermissionSettings) => void;
  exportBackupJson: () => string;
  clearAllLocalData: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  isOnboarded: true, // true by default so app runs, Onboarding can be triggered
  pin: "1234",
  isBiometricEnabled: true,
  autoLockTimeout: "5min",
  themeMode: "dark",
  reducedMotion: false,
  syncCategories: {
    money: false,
    vault: false,
    plan: false,
    usage: false,
    activity: false,
    contacts: false,
  },
  permissions: {
    sms: true,
    location: true,
    camera: true,
    notifications: true,
  },
  lastBackupTime: "Yesterday at 11:30 PM",

  completeOnboarding: (newPin) => {
    set({
      isOnboarded: true,
      pin: newPin || "1234",
    });
  },

  setPin: (newPin) => {
    set({ pin: newPin });
  },

  setBiometricEnabled: (enabled) => {
    set({ isBiometricEnabled: enabled });
  },

  setAutoLockTimeout: (timeout) => {
    set({ autoLockTimeout: timeout });
  },

  setThemeMode: (mode) => {
    set({ themeMode: mode });
  },

  setReducedMotion: (reduced) => {
    set({ reducedMotion: reduced });
  },

  toggleSyncCategory: (category) => {
    set((state) => ({
      syncCategories: {
        ...state.syncCategories,
        [category]: !state.syncCategories[category],
      },
    }));
  },

  togglePermission: (perm) => {
    set((state) => ({
      permissions: {
        ...state.permissions,
        [perm]: !state.permissions[perm],
      },
    }));
  },

  exportBackupJson: () => {
    const timestamp = new Date().toISOString();
    const backupData = {
      app: "MyLifeOS",
      version: "0.1.0",
      exportDate: timestamp,
      meta: {
        deviceStorageEncrypted: true,
        schemaVersion: 1,
      },
    };
    set({ lastBackupTime: "Just now" });
    return JSON.stringify(backupData, null, 2);
  },

  clearAllLocalData: () => {
    set({
      pin: "1234",
      lastBackupTime: "Never",
      syncCategories: {
        money: false,
        vault: false,
        plan: false,
        usage: false,
        activity: false,
        contacts: false,
      },
    });
  },
}));
