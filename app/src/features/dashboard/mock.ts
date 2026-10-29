export interface DashboardMockData {
  greeting: string;
  formattedDate: string;
  money: {
    spentTodayMinor: number;
    receivedTodayMinor: number;
    currency: string;
    monthlyBudgetSpentPercent: number;
    recentTransactions: Array<{
      id: string;
      merchant: string;
      amountMinor: number;
      type: "income" | "expense";
      category: string;
      time: string;
    }>;
  };
  planner: {
    overdueCount: number;
    nextTask: {
      id: string;
      title: string;
      time: string;
      priority: number;
    } | null;
    totalToday: number;
    completedToday: number;
  };
  phoneUsage: {
    screenTimeMinutes: number;
    screenTimeTargetMinutes: number;
    topApp: {
      name: string;
      durationMinutes: number;
      icon: string;
    };
    trend: number[];
  };
  activity: {
    steps: number;
    stepsTarget: number;
    distanceKm: number;
    activeMinutes: number;
  };
  shopping: {
    openListCount: number;
    openItemCount: number;
    estimatedTotalMinor: number;
    nextList: {
      name: string;
      itemsLeft: number;
    };
  };
  vault: {
    recentNote: {
      id: string;
      title: string;
      updatedAt: string;
    };
    recentReceipt: {
      id: string;
      merchant: string;
      amountMinor: number;
      date: string;
    };
  };
}

export const mockDashboardData: DashboardMockData = {
  greeting: "Good afternoon, Babu",
  formattedDate: "Friday, 25 Sep",
  money: {
    spentTodayMinor: 325000, // 3,250.00 KES
    receivedTodayMinor: 1500000, // 15,000.00 KES
    currency: "KES",
    monthlyBudgetSpentPercent: 0.64,
    recentTransactions: [
      {
        id: "tx-1",
        merchant: "Java House",
        amountMinor: 85000,
        type: "expense",
        category: "Food & Dining",
        time: "1:15 PM",
      },
      {
        id: "tx-2",
        merchant: "Client Payment",
        amountMinor: 1500000,
        type: "income",
        category: "Salary",
        time: "10:30 AM",
      },
      {
        id: "tx-3",
        merchant: "Total Energies",
        amountMinor: 240000,
        type: "expense",
        category: "Transport",
        time: "8:45 AM",
      },
    ],
  },
  planner: {
    overdueCount: 1,
    nextTask: {
      id: "task-1",
      title: "Review monthly infrastructure cost",
      time: "3:00 PM",
      priority: 2,
    },
    totalToday: 6,
    completedToday: 4,
  },
  phoneUsage: {
    screenTimeMinutes: 195, // 3h 15m
    screenTimeTargetMinutes: 300,
    topApp: {
      name: "Telegram",
      durationMinutes: 72,
      icon: "paper-plane-outline",
    },
    trend: [35, 45, 20, 60, 45, 50, 40],
  },
  activity: {
    steps: 6840,
    stepsTarget: 10000,
    distanceKm: 5.2,
    activeMinutes: 48,
  },
  shopping: {
    openListCount: 2,
    openItemCount: 7,
    estimatedTotalMinor: 480000, // 4,800.00 KES
    nextList: {
      name: "Weekly Groceries",
      itemsLeft: 5,
    },
  },
  vault: {
    recentNote: {
      id: "note-1",
      title: "System Architecture & Security Keys",
      updatedAt: "Yesterday",
    },
    recentReceipt: {
      id: "rec-1",
      merchant: "Naivas Supermarket",
      amountMinor: 285000,
      date: "23 Sep",
    },
  },
};
