import { create } from "zustand";
import type { Receipt } from "@shared/entities";
import { ReceiptSource } from "@shared/enums";
import { initialMockReceipts, initialMockDuplicate, type DuplicateCandidate } from "../mock";

export type ReceiptFilter = {
  search: string;
  categoryId?: string;
  merchant?: string;
  dateRange?: "all" | "month" | "recent";
};

export type ReceiptsState = {
  receipts: Receipt[];
  viewMode: "grid" | "list";
  filter: ReceiptFilter;
  activeDuplicate: DuplicateCandidate | null;

  // Actions
  setViewMode: (mode: "grid" | "list") => void;
  setFilter: (filter: Partial<ReceiptFilter>) => void;
  resetFilter: () => void;
  addReceipt: (data: {
    merchant: string;
    amount_minor: number;
    currency?: string;
    occurred_at?: string;
    category_id?: string | null;
    source?: ReceiptSource;
    extracted_text?: string;
    items?: Array<{ name: string; quantity: number; unit_price_minor: number }>;
  }) => Receipt;
  updateReceipt: (id: string, updates: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  getReceiptById: (id: string) => Receipt | undefined;
  getFilteredReceipts: () => Receipt[];
  resolveDuplicate: (action: "keep_both" | "merge" | "ignore") => void;
};

export const useReceiptsStore = create<ReceiptsState>((set, get) => ({
  receipts: initialMockReceipts,
  viewMode: "grid",
  filter: {
    search: "",
    dateRange: "all",
  },
  activeDuplicate: initialMockDuplicate,

  setViewMode: (mode) => set({ viewMode: mode }),

  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),

  resetFilter: () =>
    set({
      filter: { search: "", dateRange: "all" },
    }),

  addReceipt: (data) => {
    const now = new Date().toISOString();
    const id = `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newReceipt: Receipt = {
      id,
      file_path: `file:///data/user/0/com.mylifeos.app/files/receipts/${id}.jpg`,
      mime: "image/jpeg",
      source: data.source ?? ReceiptSource.Camera,
      merchant: data.merchant,
      amount_minor: data.amount_minor,
      currency: data.currency ?? "KES",
      occurred_at: data.occurred_at ?? now,
      category_id: data.category_id ?? null,
      extracted_text: data.extracted_text ?? `${data.merchant}\nTotal: KES ${(data.amount_minor / 100).toFixed(2)}`,
      items: (data.items ?? []).map((it, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        receipt_id: id,
        name: it.name,
        quantity: it.quantity,
        unit_price_minor: it.unit_price_minor,
      })),
      dedup_hash: `hash_${data.merchant.toLowerCase().replace(/\s+/g, "_")}_${data.amount_minor}`,
      sync_state: "local_only",
      version: 1,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({
      receipts: [newReceipt, ...state.receipts],
    }));

    return newReceipt;
  },

  updateReceipt: (id, updates) =>
    set((state) => ({
      receipts: state.receipts.map((r) =>
        r.id === id
          ? {
              ...r,
              ...updates,
              updated_at: new Date().toISOString(),
              version: r.version + 1,
            }
          : r
      ),
    })),

  deleteReceipt: (id) =>
    set((state) => ({
      receipts: state.receipts.filter((r) => r.id !== id),
      activeDuplicate:
        state.activeDuplicate?.receiptA.id === id || state.activeDuplicate?.receiptB.id === id
          ? null
          : state.activeDuplicate,
    })),

  getReceiptById: (id) => {
    return get().receipts.find((r) => r.id === id);
  },

  getFilteredReceipts: () => {
    const { receipts, filter } = get();
    return receipts.filter((r) => {
      // Category filter
      if (filter.categoryId && r.category_id !== filter.categoryId) {
        return false;
      }
      // Merchant filter
      if (filter.merchant && r.merchant?.toLowerCase() !== filter.merchant.toLowerCase()) {
        return false;
      }
      // Date range filter
      if (filter.dateRange === "month" && r.occurred_at) {
        const d = new Date(r.occurred_at);
        const now = new Date();
        if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }
      // Search filter
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        const merchantMatch = r.merchant?.toLowerCase().includes(query) ?? false;
        const ocrMatch = r.extracted_text?.toLowerCase().includes(query) ?? false;
        const itemMatch =
          r.items?.some((it) => it.name.toLowerCase().includes(query)) ?? false;
        return merchantMatch || ocrMatch || itemMatch;
      }
      return true;
    });
  },

  resolveDuplicate: (action) => {
    const { activeDuplicate } = get();
    if (!activeDuplicate) return;

    if (action === "merge") {
      // Merge: Keep receiptA, combine items, remove receiptB
      set((state) => ({
        receipts: state.receipts
          .map((r) => {
            if (r.id === activeDuplicate.receiptA.id) {
              const combinedItems = [
                ...(r.items ?? []),
                ...(activeDuplicate.receiptB.items ?? []).filter(
                  (bIt) => !r.items?.some((aIt) => aIt.name === bIt.name)
                ),
              ];
              return {
                ...r,
                items: combinedItems,
                updated_at: new Date().toISOString(),
                version: r.version + 1,
              };
            }
            return r;
          })
          .filter((r) => r.id !== activeDuplicate.receiptB.id),
        activeDuplicate: null,
      }));
    } else {
      // "keep_both" or "ignore" simply dismisses the duplicate review banner
      set({ activeDuplicate: null });
    }
  },
}));
