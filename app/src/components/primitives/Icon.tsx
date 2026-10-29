import React from "react";
import { View, StyleSheet, type ViewStyle } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";

/**
 * Modern SVG Vector Icon set for MyLifeOS.
 * Renders crisp, scalable vector graphics across Web and Native.
 */

type IconDef = {
  paths: {
    d: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: "round" | "butt" | "square";
    strokeLinejoin?: "round" | "miter" | "bevel";
  }[];
  circles?: { cx: number; cy: number; r: number; fill?: string; stroke?: string; strokeWidth?: number }[];
  rects?: { x: number; y: number; width: number; height: number; rx?: number; fill?: string; stroke?: string; strokeWidth?: number }[];
};

// SVG paths designed on 24x24 grid
const VECTOR_ICONS: Record<string, IconDef> = {
  // Navigation
  "home": {
    paths: [
      { d: "M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z", fill: "currentColor" },
    ],
  },
  "home-outline": {
    paths: [
      { d: "M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinejoin: "round" },
    ],
  },
  "grid": {
    rects: [
      { x: 3, y: 3, width: 7, height: 7, rx: 2, fill: "currentColor" },
      { x: 14, y: 3, width: 7, height: 7, rx: 2, fill: "currentColor" },
      { x: 3, y: 14, width: 7, height: 7, rx: 2, fill: "currentColor" },
      { x: 14, y: 14, width: 7, height: 7, rx: 2, fill: "currentColor" },
    ],
    paths: [],
  },
  "grid-outline": {
    rects: [
      { x: 3, y: 3, width: 7, height: 7, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" },
      { x: 14, y: 3, width: 7, height: 7, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" },
      { x: 3, y: 14, width: 7, height: 7, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" },
      { x: 14, y: 14, width: 7, height: 7, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" },
    ],
    paths: [],
  },
  "apps": {
    rects: [
      { x: 4, y: 4, width: 6, height: 6, rx: 1.5, fill: "currentColor" },
      { x: 14, y: 4, width: 6, height: 6, rx: 1.5, fill: "currentColor" },
      { x: 4, y: 14, width: 6, height: 6, rx: 1.5, fill: "currentColor" },
      { x: 14, y: 14, width: 6, height: 6, rx: 1.5, fill: "currentColor" },
    ],
    paths: [],
  },

  // Finance / Money
  "cash": {
    rects: [{ x: 2, y: 6, width: 20, height: 12, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    circles: [{ cx: 12, cy: 12, r: 2.5, fill: "currentColor" }],
    paths: [{ d: "M6 12h.01M18 12h.01", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }],
  },
  "cash-outline": {
    rects: [{ x: 2, y: 6, width: 20, height: 12, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    circles: [{ cx: 12, cy: 12, r: 2.5, stroke: "currentColor", strokeWidth: 1.8, fill: "none" }],
    paths: [],
  },
  "wallet": {
    paths: [
      { d: "M20 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M16 12h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z", fill: "currentColor" },
    ],
  },
  "wallet-outline": {
    paths: [
      { d: "M20 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M16 12h5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z", stroke: "currentColor", strokeWidth: 2, fill: "none" },
    ],
    circles: [{ cx: 18, cy: 15, r: 1, fill: "currentColor" }],
  },
  "card": {
    rects: [{ x: 2, y: 5, width: 20, height: 14, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    paths: [{ d: "M2 10h20", stroke: "currentColor", strokeWidth: 2 }],
  },
  "card-outline": {
    rects: [{ x: 2, y: 5, width: 20, height: 14, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    paths: [
      { d: "M2 10h20", stroke: "currentColor", strokeWidth: 2 },
      { d: "M6 15h4", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" },
    ],
  },
  "trending-up": {
    paths: [
      { d: "M23 6l-9.5 9.5-5-5L1 18", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
      { d: "M17 6h6v6", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "trending-down": {
    paths: [
      { d: "M23 18l-9.5-9.5-5 5L1 6", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
      { d: "M17 18h6v-6", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "receipt": {
    paths: [
      { d: "M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2zM8 7h8M8 11h8M8 15h5", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
    ],
  },
  "receipt-outline": {
    paths: [
      { d: "M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2zM8 7h8M8 11h8M8 15h5", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
    ],
  },

  // Vault / Security
  "lock-closed": {
    rects: [{ x: 5, y: 11, width: 14, height: 10, rx: 2, fill: "currentColor" }],
    paths: [{ d: "M8 11V7a4 4 0 0 1 8 0v4", stroke: "currentColor", strokeWidth: 2.2, fill: "none", strokeLinecap: "round" }],
  },
  "lock-closed-outline": {
    rects: [{ x: 5, y: 11, width: 14, height: 10, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    paths: [
      { d: "M8 11V7a4 4 0 0 1 8 0v4", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M12 15v2", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" },
    ],
  },
  "lock-open-outline": {
    rects: [{ x: 5, y: 11, width: 14, height: 10, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    paths: [{ d: "M8 11V7a4 4 0 0 1 7.5-1.9", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" }],
  },
  "shield-checkmark": {
    paths: [
      { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", fill: "currentColor" },
      { d: "M9 12l2 2 4-4", stroke: "#000", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "shield-checkmark-outline": {
    paths: [
      { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinejoin: "round" },
      { d: "M9 12l2 2 4-4", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "key": {
    paths: [
      { d: "M21 2l-2 2m-1.5 1.5L14 9l2 2-3 3-2-2-4 4a5 5 0 1 1-7-7l4-4 2 2 3-3-2-2 3.5-3.5", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
    ],
  },
  "key-outline": {
    paths: [
      { d: "M21 2l-2 2m-1.5 1.5L14 9l2 2-3 3-2-2-4 4a5 5 0 1 1-7-7l4-4 2 2 3-3-2-2 3.5-3.5", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
    ],
  },
  "finger-print-outline": {
    paths: [
      { d: "M12 11c0-1.7-1.3-3-3-3s-3 1.3-3 3c0 3 2.5 5 5 7", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M12 7c-2.8 0-5 2.2-5 5 0 4 3 6.5 6 9", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M17 11c0-2.8-2.2-5-5-5", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M15 15c1 1.5 1.5 3 1.5 4.5", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
    ],
  },

  // Planner / Calendar
  "calendar": {
    rects: [{ x: 3, y: 4, width: 18, height: 18, rx: 2, fill: "currentColor" }],
    paths: [
      { d: "M16 2v4M8 2v4M3 10h18", stroke: "#000", strokeWidth: 2, strokeLinecap: "round" },
    ],
  },
  "calendar-outline": {
    rects: [{ x: 3, y: 4, width: 18, height: 18, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    paths: [
      { d: "M16 2v4M8 2v4M3 10h18", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" },
    ],
  },
  "today": {
    rects: [{ x: 3, y: 4, width: 18, height: 18, rx: 2, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    paths: [
      { d: "M16 2v4M8 2v4M3 10h18", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" },
      { d: "M8 14h2v2H8z", fill: "currentColor" },
    ],
  },

  // Settings & System
  "settings": {
    circles: [{ cx: 12, cy: 12, r: 3, fill: "currentColor" }],
    paths: [
      { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z", stroke: "currentColor", strokeWidth: 1.8, fill: "none" },
    ],
  },
  "settings-outline": {
    circles: [{ cx: 12, cy: 12, r: 3, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    paths: [
      { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z", stroke: "currentColor", strokeWidth: 1.8, fill: "none" },
    ],
  },
  "notifications": {
    paths: [
      { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", fill: "currentColor" },
      { d: "M13.73 21a2 2 0 0 1-3.46 0", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" },
    ],
  },
  "notifications-outline": {
    paths: [
      { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M13.73 21a2 2 0 0 1-3.46 0", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" },
    ],
  },
  "camera": {
    paths: [
      { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", fill: "currentColor" },
    ],
    circles: [{ cx: 12, cy: 13, r: 4, fill: "#000" }],
  },
  "camera-outline": {
    paths: [
      { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinejoin: "round" },
    ],
    circles: [{ cx: 12, cy: 13, r: 4, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
  },
  "location": {
    paths: [
      { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", fill: "currentColor" },
    ],
    circles: [{ cx: 12, cy: 10, r: 3, fill: "#000" }],
  },
  "location-outline": {
    paths: [
      { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", stroke: "currentColor", strokeWidth: 2, fill: "none" },
    ],
    circles: [{ cx: 12, cy: 10, r: 3, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
  },
  "people": {
    paths: [
      { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M23 21v-2a4 4 0 0 0-3-3.87", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M16 3.13a4 4 0 0 1 0 7.75", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
    ],
    circles: [{ cx: 9, cy: 7, r: 4, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
  },
  "people-outline": {
    paths: [
      { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M23 21v-2a4 4 0 0 0-3-3.87", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
      { d: "M16 3.13a4 4 0 0 1 0 7.75", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
    ],
    circles: [{ cx: 9, cy: 7, r: 4, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
  },
  "person": {
    paths: [
      { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
    ],
    circles: [{ cx: 12, cy: 7, r: 4, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
  },
  "person-outline": {
    paths: [
      { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
    ],
    circles: [{ cx: 12, cy: 7, r: 4, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
  },
  "cloud-download": {
    paths: [
      { d: "M8 17l4 4 4-4M12 12v9M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "cloud-download-outline": {
    paths: [
      { d: "M8 17l4 4 4-4M12 12v9M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "cloud-upload-outline": {
    paths: [
      { d: "M16 16l-4-4-4 4M12 12v9M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "download-outline": {
    paths: [
      { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "trash-outline": {
    paths: [
      { d: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "refresh-outline": {
    paths: [
      { d: "M23 4v6h-6M1 20v-6h6", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
      { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "chevron-forward": {
    paths: [{ d: "M9 18l6-6-6-6", stroke: "currentColor", strokeWidth: 2.2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }],
  },
  "chevron-back": {
    paths: [{ d: "M15 18l-6-6 6-6", stroke: "currentColor", strokeWidth: 2.2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }],
  },
  "chevron-down": {
    paths: [{ d: "M6 9l6 6 6-6", stroke: "currentColor", strokeWidth: 2.2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }],
  },
  "chevron-up": {
    paths: [{ d: "M18 15l-6-6-6 6", stroke: "currentColor", strokeWidth: 2.2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }],
  },
  "arrow-back": {
    paths: [{ d: "M19 12H5M12 19l-7-7 7-7", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }],
  },
  "arrow-forward": {
    paths: [{ d: "M5 12h14M12 5l7 7-7 7", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }],
  },
  "close": {
    paths: [{ d: "M18 6L6 18M6 6l12 12", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }],
  },
  "close-outline": {
    paths: [{ d: "M18 6L6 18M6 6l12 12", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }],
  },
  "add": {
    paths: [{ d: "M12 5v14M5 12h14", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round" }],
  },
  "add-circle": {
    circles: [{ cx: 12, cy: 12, r: 10, fill: "currentColor" }],
    paths: [{ d: "M12 8v8M8 12h8", stroke: "#000", strokeWidth: 2, strokeLinecap: "round" }],
  },
  "search": {
    circles: [{ cx: 11, cy: 11, r: 8, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    paths: [{ d: "M21 21l-4.35-4.35", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }],
  },
  "search-outline": {
    circles: [{ cx: 11, cy: 11, r: 8, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    paths: [{ d: "M21 21l-4.35-4.35", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }],
  },
  "checkmark": {
    paths: [{ d: "M20 6L9 17l-5-5", stroke: "currentColor", strokeWidth: 2.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }],
  },
  "checkmark-circle": {
    circles: [{ cx: 12, cy: 12, r: 10, fill: "currentColor" }],
    paths: [{ d: "M8 12l3 3 5-5", stroke: "#000", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }],
  },
  "cube-outline": {
    paths: [
      { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", stroke: "currentColor", strokeWidth: 1.8, fill: "none" },
      { d: "M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" },
    ],
  },
  "fitness-outline": {
    paths: [
      { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", stroke: "currentColor", strokeWidth: 2, fill: "none" },
      { d: "M3.5 12h5l2.5-4 3 8 2-4h4.5", stroke: "currentColor", strokeWidth: 1.8, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "hourglass-outline": {
    paths: [
      { d: "M5 22h14M5 2h14M17 22v-4.17a3 3 0 0 0-.88-2.12L13.5 13.1a1 1 0 0 1 0-1.42l2.62-2.61A3 3 0 0 0 17 6.17V2M7 2v4.17a3 3 0 0 0 .88 2.12L10.5 10.9a1 1 0 0 1 0 1.42L7.88 15.71A3 3 0 0 0 7 17.83V22", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "speedometer-outline": {
    paths: [
      { d: "M12 14l4-4M3.34 19a10 10 0 1 1 17.32 0", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" },
    ],
    circles: [{ cx: 12, cy: 14, r: 2, fill: "currentColor" }],
  },
  "document-text-outline": {
    paths: [
      { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", stroke: "currentColor", strokeWidth: 2, fill: "none" },
      { d: "M14 2v6h6M16 13H8M16 17H8M10 9H8", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" },
    ],
  },
  "code-slash-outline": {
    paths: [
      { d: "M16 18l6-6-6-6M8 6l-6 6 6 6", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "open-outline": {
    paths: [
      { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
  "alert-circle-outline": {
    circles: [{ cx: 12, cy: 12, r: 10, stroke: "currentColor", strokeWidth: 2, fill: "none" }],
    paths: [
      { d: "M12 8v4M12 16h.01", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" },
    ],
  },
  "log-out-outline": {
    paths: [
      { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" },
    ],
  },
};

export type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, color = "#9AA3AF", style }) => {
  // Normalize name
  const iconDef =
    VECTOR_ICONS[name] ||
    VECTOR_ICONS[name.toLowerCase()] ||
    VECTOR_ICONS[name.replace(/-outline$/, "")] ||
    VECTOR_ICONS[name + "-outline"];

  if (!iconDef) {
    // Elegant fallback: small clean circle or dot
    return (
      <View
        style={[
          styles.fallback,
          { width: size, height: size },
          style,
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={4} fill={color} />
        </Svg>
      </View>
    );
  }

  return (
    <View style={[{ width: size, height: size, alignItems: "center", justifyContent: "center" }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {iconDef.rects?.map((r, i) => (
          <Rect
            key={`r-${i}`}
            x={r.x}
            y={r.y}
            width={r.width}
            height={r.height}
            rx={r.rx}
            fill={r.fill === "currentColor" ? color : (r.fill ?? "none")}
            stroke={r.stroke === "currentColor" ? color : (r.stroke ?? "none")}
            strokeWidth={r.strokeWidth}
          />
        ))}
        {iconDef.circles?.map((c, i) => (
          <Circle
            key={`c-${i}`}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            fill={c.fill === "currentColor" ? color : (c.fill ?? "none")}
            stroke={c.stroke === "currentColor" ? color : (c.stroke ?? "none")}
            strokeWidth={c.strokeWidth}
          />
        ))}
        {iconDef.paths?.map((p, i) => (
          <Path
            key={`p-${i}`}
            d={p.d}
            fill={p.fill === "currentColor" ? color : (p.fill ?? "none")}
            stroke={p.stroke === "currentColor" ? color : (p.stroke ?? "none")}
            strokeWidth={p.strokeWidth}
            strokeLinecap={p.strokeLinecap}
            strokeLinejoin={p.strokeLinejoin}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Icon;
