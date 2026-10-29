/**
 * Mock data for Activity feature (Batch 10)
 */

export interface ActivityToday {
  steps: number;
  stepsTarget: number;
  distanceKm: number;
  distanceTargetKm: number;
  activeMinutes: number;
  activeMinutesTarget: number;
  caloriesBurned: number;
  caloriesTarget: number;
  hourlySteps: number[]; // 24 hours: 0..23
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  steps: number;
  stepsTarget: number;
  distanceKm: number;
  activeMinutes: number;
  caloriesBurned: number;
  goalAchieved: boolean;
  level: 0 | 1 | 2 | 3 | 4; // for heatmap intensity
}

export interface WorkoutItem {
  id: string;
  type: string;
  title: string;
  icon: string;
  startTime: string; // e.g. "07:30 AM"
  durationMinutes: number;
  distanceKm?: number;
  calories: number;
  avgHeartRate?: number;
}

export const mockTodayActivity: ActivityToday = {
  steps: 8420,
  stepsTarget: 10000,
  distanceKm: 6.2,
  distanceTargetKm: 7.5,
  activeMinutes: 48,
  activeMinutesTarget: 60,
  caloriesBurned: 490,
  caloriesTarget: 550,
  hourlySteps: [
    0, 0, 0, 0, 0, 0, 180, 750, 1200, 640, 320, 980, 1100, 450, 300, 420, 280,
    850, 620, 280, 0, 0, 0, 0,
  ],
};

export const mockWeeklyActivity: ActivityDay[] = [
  {
    date: "2026-09-18",
    dayLabel: "Fri",
    steps: 10450,
    stepsTarget: 10000,
    distanceKm: 7.8,
    activeMinutes: 65,
    caloriesBurned: 580,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-19",
    dayLabel: "Sat",
    steps: 12300,
    stepsTarget: 10000,
    distanceKm: 9.1,
    activeMinutes: 78,
    caloriesBurned: 690,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-20",
    dayLabel: "Sun",
    steps: 7200,
    stepsTarget: 10000,
    distanceKm: 5.4,
    activeMinutes: 42,
    caloriesBurned: 410,
    goalAchieved: false,
    level: 2,
  },
  {
    date: "2026-09-21",
    dayLabel: "Mon",
    steps: 9600,
    stepsTarget: 10000,
    distanceKm: 7.1,
    activeMinutes: 55,
    caloriesBurned: 530,
    goalAchieved: false,
    level: 3,
  },
  {
    date: "2026-09-22",
    dayLabel: "Tue",
    steps: 11200,
    stepsTarget: 10000,
    distanceKm: 8.3,
    activeMinutes: 68,
    caloriesBurned: 610,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-23",
    dayLabel: "Wed",
    steps: 8900,
    stepsTarget: 10000,
    distanceKm: 6.6,
    activeMinutes: 50,
    caloriesBurned: 480,
    goalAchieved: false,
    level: 3,
  },
  {
    date: "2026-09-24",
    dayLabel: "Thu",
    steps: 8420,
    stepsTarget: 10000,
    distanceKm: 6.2,
    activeMinutes: 48,
    caloriesBurned: 490,
    goalAchieved: false,
    level: 3,
  },
];

// 28 days of history for heatmap / list
export const mockActivityHistory: ActivityDay[] = [
  ...mockWeeklyActivity,
  {
    date: "2026-09-17",
    dayLabel: "Thu",
    steps: 11400,
    stepsTarget: 10000,
    distanceKm: 8.5,
    activeMinutes: 70,
    caloriesBurned: 620,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-16",
    dayLabel: "Wed",
    steps: 8600,
    stepsTarget: 10000,
    distanceKm: 6.4,
    activeMinutes: 47,
    caloriesBurned: 470,
    goalAchieved: false,
    level: 3,
  },
  {
    date: "2026-09-15",
    dayLabel: "Tue",
    steps: 10200,
    stepsTarget: 10000,
    distanceKm: 7.6,
    activeMinutes: 62,
    caloriesBurned: 560,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-14",
    dayLabel: "Mon",
    steps: 6400,
    stepsTarget: 10000,
    distanceKm: 4.8,
    activeMinutes: 35,
    caloriesBurned: 350,
    goalAchieved: false,
    level: 2,
  },
  {
    date: "2026-09-13",
    dayLabel: "Sun",
    steps: 13500,
    stepsTarget: 10000,
    distanceKm: 10.2,
    activeMinutes: 85,
    caloriesBurned: 740,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-12",
    dayLabel: "Sat",
    steps: 11800,
    stepsTarget: 10000,
    distanceKm: 8.8,
    activeMinutes: 72,
    caloriesBurned: 640,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-11",
    dayLabel: "Fri",
    steps: 9200,
    stepsTarget: 10000,
    distanceKm: 6.9,
    activeMinutes: 52,
    caloriesBurned: 510,
    goalAchieved: false,
    level: 3,
  },
  {
    date: "2026-09-10",
    dayLabel: "Thu",
    steps: 5100,
    stepsTarget: 10000,
    distanceKm: 3.8,
    activeMinutes: 28,
    caloriesBurned: 290,
    goalAchieved: false,
    level: 1,
  },
  {
    date: "2026-09-09",
    dayLabel: "Wed",
    steps: 10800,
    stepsTarget: 10000,
    distanceKm: 8.1,
    activeMinutes: 66,
    caloriesBurned: 590,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-08",
    dayLabel: "Tue",
    steps: 9800,
    stepsTarget: 10000,
    distanceKm: 7.3,
    activeMinutes: 58,
    caloriesBurned: 540,
    goalAchieved: false,
    level: 3,
  },
  {
    date: "2026-09-07",
    dayLabel: "Mon",
    steps: 7800,
    stepsTarget: 10000,
    distanceKm: 5.8,
    activeMinutes: 44,
    caloriesBurned: 430,
    goalAchieved: false,
    level: 2,
  },
  {
    date: "2026-09-06",
    dayLabel: "Sun",
    steps: 14200,
    stepsTarget: 10000,
    distanceKm: 10.8,
    activeMinutes: 92,
    caloriesBurned: 790,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-05",
    dayLabel: "Sat",
    steps: 12100,
    stepsTarget: 10000,
    distanceKm: 9.0,
    activeMinutes: 76,
    caloriesBurned: 670,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-04",
    dayLabel: "Fri",
    steps: 8900,
    stepsTarget: 10000,
    distanceKm: 6.7,
    activeMinutes: 51,
    caloriesBurned: 490,
    goalAchieved: false,
    level: 3,
  },
  {
    date: "2026-09-03",
    dayLabel: "Thu",
    steps: 10100,
    stepsTarget: 10000,
    distanceKm: 7.5,
    activeMinutes: 61,
    caloriesBurned: 550,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-09-02",
    dayLabel: "Wed",
    steps: 7400,
    stepsTarget: 10000,
    distanceKm: 5.5,
    activeMinutes: 41,
    caloriesBurned: 410,
    goalAchieved: false,
    level: 2,
  },
  {
    date: "2026-09-01",
    dayLabel: "Tue",
    steps: 9900,
    stepsTarget: 10000,
    distanceKm: 7.4,
    activeMinutes: 59,
    caloriesBurned: 540,
    goalAchieved: false,
    level: 3,
  },
  {
    date: "2026-08-31",
    dayLabel: "Mon",
    steps: 4200,
    stepsTarget: 10000,
    distanceKm: 3.1,
    activeMinutes: 24,
    caloriesBurned: 240,
    goalAchieved: false,
    level: 1,
  },
  {
    date: "2026-08-30",
    dayLabel: "Sun",
    steps: 11000,
    stepsTarget: 10000,
    distanceKm: 8.2,
    activeMinutes: 68,
    caloriesBurned: 600,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-08-29",
    dayLabel: "Sat",
    steps: 10600,
    stepsTarget: 10000,
    distanceKm: 7.9,
    activeMinutes: 64,
    caloriesBurned: 580,
    goalAchieved: true,
    level: 4,
  },
  {
    date: "2026-08-28",
    dayLabel: "Fri",
    steps: 6800,
    stepsTarget: 10000,
    distanceKm: 5.1,
    activeMinutes: 38,
    caloriesBurned: 380,
    goalAchieved: false,
    level: 2,
  },
];

export const mockWorkouts: WorkoutItem[] = [
  {
    id: "workout_1",
    type: "Walking",
    title: "Morning Park Walk",
    icon: "walk-outline",
    startTime: "07:45 AM",
    durationMinutes: 32,
    distanceKm: 2.8,
    calories: 185,
    avgHeartRate: 112,
  },
  {
    id: "workout_2",
    type: "Running",
    title: "Interval Run",
    icon: "fitness-outline",
    startTime: "12:15 PM",
    durationMinutes: 24,
    distanceKm: 3.4,
    calories: 305,
    avgHeartRate: 154,
  },
];
