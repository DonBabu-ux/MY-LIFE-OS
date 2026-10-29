import { create } from "zustand";
import { ShoppingListStatus } from "@shared/enums";
import type { ShoppingList, ShoppingItem, PriceHistory } from "@shared/entities";
import {
  initialMockShoppingLists,
  initialMockShoppingItems,
  initialMockPriceHistories,
} from "../mock";

export type ShoppingState = {
  lists: ShoppingList[];
  items: ShoppingItem[];
  priceHistories: PriceHistory[];
  filterStatus: ShoppingListStatus | "all";

  // Actions
  setFilterStatus: (status: ShoppingListStatus | "all") => void;
  createList: (data: { name: string; budget_minor?: number | null; currency?: string }) => ShoppingList;
  updateList: (id: string, updates: Partial<ShoppingList>) => void;
  deleteList: (id: string) => void;

  addItem: (data: {
    list_id: string;
    name: string;
    quantity: number;
    unit?: string | null;
    priority?: number;
    estimated_price_minor?: number | null;
  }) => ShoppingItem;
  updateItem: (id: string, updates: Partial<ShoppingItem>) => void;
  deleteItem: (id: string) => void;
  togglePurchased: (id: string) => void;
  updateItemQty: (id: string, delta: number) => void;
  linkItemToTransaction: (itemId: string, transactionId: string, actualPriceMinor?: number | null) => void;

  // Computed helpers
  getListById: (id: string) => ShoppingList | undefined;
  getItemsByListId: (listId: string) => ShoppingItem[];
  getListStats: (listId: string) => {
    totalEstimatedMinor: number;
    totalActualMinor: number;
    itemCount: number;
    purchasedCount: number;
    budgetMinor: number;
    budgetRemainingMinor: number;
    percentBudgetUsed: number;
    isOverBudget: boolean;
  };
  getPriceHistory: (itemKey: string) => PriceHistory[];
};

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  lists: initialMockShoppingLists,
  items: initialMockShoppingItems,
  priceHistories: initialMockPriceHistories,
  filterStatus: "all",

  setFilterStatus: (status) => set({ filterStatus: status }),

  createList: (data) => {
    const now = new Date().toISOString();
    const newList: ShoppingList = {
      id: `list-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: data.name,
      budget_minor: data.budget_minor ?? null,
      currency: data.currency ?? "KES",
      status: ShoppingListStatus.Open,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({
      lists: [newList, ...state.lists],
    }));

    return newList;
  },

  updateList: (id, updates) =>
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l
      ),
    })),

  deleteList: (id) =>
    set((state) => ({
      lists: state.lists.filter((l) => l.id !== id),
      items: state.items.filter((i) => i.list_id !== id),
    })),

  addItem: (data) => {
    const now = new Date().toISOString();
    const newItem: ShoppingItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      list_id: data.list_id,
      name: data.name,
      quantity: Math.max(data.quantity, 1),
      unit: data.unit ?? "pcs",
      priority: data.priority ?? 2,
      estimated_price_minor: data.estimated_price_minor ?? null,
      actual_price_minor: null,
      purchased: false,
      transaction_id: null,
      sync_state: "local_only",
      version: 1,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({
      items: [...state.items, newItem],
    }));

    return newItem;
  },

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i
      ),
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  togglePurchased: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id
          ? {
              ...i,
              purchased: !i.purchased,
              actual_price_minor: !i.purchased && !i.actual_price_minor
                ? i.estimated_price_minor
                : i.actual_price_minor,
              updated_at: new Date().toISOString(),
            }
          : i
      ),
    })),

  updateItemQty: (id, delta) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id
          ? {
              ...i,
              quantity: Math.max(1, i.quantity + delta),
              updated_at: new Date().toISOString(),
            }
          : i
      ),
    })),

  linkItemToTransaction: (itemId, transactionId, actualPriceMinor) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId
          ? {
              ...i,
              purchased: true,
              transaction_id: transactionId,
              actual_price_minor: actualPriceMinor ?? i.actual_price_minor ?? i.estimated_price_minor,
              updated_at: new Date().toISOString(),
            }
          : i
      ),
    })),

  getListById: (id) => {
    return get().lists.find((l) => l.id === id);
  },

  getItemsByListId: (listId) => {
    return get().items.filter((i) => i.list_id === listId);
  },

  getListStats: (listId) => {
    const list = get().lists.find((l) => l.id === listId);
    const listItems = get().items.filter((i) => i.list_id === listId);

    let totalEstimatedMinor = 0;
    let totalActualMinor = 0;
    let purchasedCount = 0;

    for (const item of listItems) {
      const itemEst = (item.estimated_price_minor ?? 0) * (item.quantity ?? 1);
      totalEstimatedMinor += itemEst;

      if (item.purchased) {
        purchasedCount++;
        const itemAct =
          (item.actual_price_minor ?? item.estimated_price_minor ?? 0) * (item.quantity ?? 1);
        totalActualMinor += itemAct;
      }
    }

    const budgetMinor = list?.budget_minor ?? 0;
    const effectiveSpend = totalActualMinor > 0 ? totalActualMinor : totalEstimatedMinor;
    const budgetRemainingMinor = budgetMinor - effectiveSpend;
    const percentBudgetUsed = budgetMinor > 0 ? effectiveSpend / budgetMinor : 0;
    const isOverBudget = budgetMinor > 0 && effectiveSpend > budgetMinor;

    return {
      totalEstimatedMinor,
      totalActualMinor,
      itemCount: listItems.length,
      purchasedCount,
      budgetMinor,
      budgetRemainingMinor,
      percentBudgetUsed,
      isOverBudget,
    };
  },

  getPriceHistory: (itemKey) => {
    return get().priceHistories.filter(
      (ph) => ph.item_key.toLowerCase() === itemKey.toLowerCase()
    );
  },
}));
