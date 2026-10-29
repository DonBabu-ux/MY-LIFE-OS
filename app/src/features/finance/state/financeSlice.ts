import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { TransactionType, SourceType } from "@shared/enums";
import type { Transaction, Category } from "@shared/entities";
import { initialMockTransactions, mockCategories } from "../mock";

export type FinanceFilter = {
  type: TransactionType | "all";
  categoryId?: string;
  search: string;
};

export type FinanceState = {
  transactions: Transaction[];
  categories: Category[];
  filter: FinanceFilter;

  // Actions
  setFilter: (filter: Partial<FinanceFilter>) => void;
  resetFilter: () => void;
  addTransaction: (data: {
    type: TransactionType;
    amount_minor: number;
    currency?: string;
    occurred_at?: string;
    merchant?: string | null;
    reference?: string | null;
    description?: string | null;
    category_id?: string | null;
    source?: SourceType;
    receipt_id?: string | null;
  }) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Computed helpers
  getTransactionById: (id: string) => Transaction | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getFilteredTransactions: () => Transaction[];
  getSummary: () => {
    todayIncome: number;
    todayExpense: number;
    weekIncome: number;
    weekExpense: number;
    monthIncome: number;
    monthExpense: number;
    yearIncome: number;
    yearExpense: number;
    netCashflow: number;
    cashflowData: Array<{
      label: string;
      incomeMinor: number;
      expenseMinor: number;
    }>;
    categoryBreakdown: Array<{
      category: Category;
      totalMinor: number;
      percentage: number;
    }>;
  };
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: initialMockTransactions,
  categories: mockCategories,
  filter: {
    type: "all",
    search: "",
  },

  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),

  resetFilter: () =>
    set({
      filter: { type: "all", search: "" },
    }),

  addTransaction: (data) => {
    const now = new Date().toISOString();
    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: data.type,
      amount_minor: data.amount_minor,
      currency: data.currency ?? "KES",
      occurred_at: data.occurred_at ?? now,
      merchant: data.merchant ?? null,
      reference: data.reference ?? null,
      description: data.description ?? null,
      category_id: data.category_id ?? null,
      source: data.source ?? SourceType.Manual,
      receipt_id: data.receipt_id ?? null,
      sync_state: "local_only",
      version: 1,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({
      transactions: [newTx, ...state.transactions],
    }));

    return newTx;
  },

  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              ...updates,
              updated_at: new Date().toISOString(),
              version: tx.version + 1,
            }
          : tx
      ),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.id !== id),
    })),

  getTransactionById: (id) => {
    return get().transactions.find((tx) => tx.id === id);
  },

  getCategoryById: (id) => {
    return get().categories.find((cat) => cat.id === id);
  },

  getFilteredTransactions: () => {
    const { transactions, filter, categories } = get();
    return transactions.filter((tx) => {
      // Type filter
      if (filter.type !== "all" && tx.type !== filter.type) {
        return false;
      }
      // Category filter
      if (filter.categoryId && tx.category_id !== filter.categoryId) {
        return false;
      }
      // Search filter
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        const categoryName =
          categories.find((c) => c.id === tx.category_id)?.name.toLowerCase() ?? "";
        const merchantMatch = tx.merchant?.toLowerCase().includes(query) ?? false;
        const descMatch = tx.description?.toLowerCase().includes(query) ?? false;
        const refMatch = tx.reference?.toLowerCase().includes(query) ?? false;
        const catMatch = categoryName.includes(query);

        return merchantMatch || descMatch || refMatch || catMatch;
      }
      return true;
    });
  },

  getSummary: () => {
    const { transactions, categories } = get();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

    let todayIncome = 0;
    let todayExpense = 0;
    let weekIncome = 0;
    let weekExpense = 0;
    let monthIncome = 0;
    let monthExpense = 0;
    let yearIncome = 0;
    let yearExpense = 0;

    const expenseCategoryTotals: Record<string, number> = {};
    let totalExpenseMinor = 0;

    // Daily breakdown for the last 7 days
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days: Array<{ label: string; incomeMinor: number; expenseMinor: number; timestamp: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      last7Days.push({
        label: dayLabels[d.getDay()],
        incomeMinor: 0,
        expenseMinor: 0,
        timestamp: d.getTime(),
      });
    }

    for (const tx of transactions) {
      const txDate = new Date(tx.occurred_at);
      const txTime = txDate.getTime();

      if (tx.type === TransactionType.Income) {
        if (txTime >= startOfToday) todayIncome += tx.amount_minor;
        if (txTime >= startOfWeek) weekIncome += tx.amount_minor;
        if (txTime >= startOfMonth) monthIncome += tx.amount_minor;
        if (txTime >= startOfYear) yearIncome += tx.amount_minor;
      } else if (tx.type === TransactionType.Expense) {
        if (txTime >= startOfToday) todayExpense += tx.amount_minor;
        if (txTime >= startOfWeek) weekExpense += tx.amount_minor;
        if (txTime >= startOfMonth) monthExpense += tx.amount_minor;
        if (txTime >= startOfYear) yearExpense += tx.amount_minor;

        totalExpenseMinor += tx.amount_minor;
        const catId = tx.category_id ?? "uncategorized";
        expenseCategoryTotals[catId] = (expenseCategoryTotals[catId] ?? 0) + tx.amount_minor;
      }

      // Check for 7 days bucket
      const txDayStart = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate()).getTime();
      const bucket = last7Days.find((b) => b.timestamp === txDayStart);
      if (bucket) {
        if (tx.type === TransactionType.Income) {
          bucket.incomeMinor += tx.amount_minor;
        } else if (tx.type === TransactionType.Expense) {
          bucket.expenseMinor += tx.amount_minor;
        }
      }
    }

    const netCashflow = monthIncome - monthExpense;

    const categoryBreakdown = Object.entries(expenseCategoryTotals)
      .map(([catId, total]) => {
        const cat = categories.find((c) => c.id === catId) ?? {
          id: "other",
          name: "Other",
          kind: "expense" as any,
          icon: "ellipsis-horizontal-circle-outline",
          color: "#9E9E9E",
          is_system: false,
          sort_order: 99,
          created_at: "",
          updated_at: "",
        };

        return {
          category: cat,
          totalMinor: total,
          percentage: totalExpenseMinor > 0 ? total / totalExpenseMinor : 0,
        };
      })
      .sort((a, b) => b.totalMinor - a.totalMinor);

    const cashflowData = last7Days.map(({ label, incomeMinor, expenseMinor }) => ({
      label,
      incomeMinor,
      expenseMinor,
    }));

    return {
      todayIncome,
      todayExpense,
      weekIncome,
      weekExpense,
      monthIncome,
      monthExpense,
      yearIncome,
      yearExpense,
      netCashflow,
      cashflowData,
      categoryBreakdown,
    };
  },
}));
