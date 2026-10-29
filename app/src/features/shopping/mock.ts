import { ShoppingListStatus } from "@shared/enums";
import type { ShoppingList, ShoppingItem, PriceHistory } from "@shared/entities";

export const initialMockShoppingLists: ShoppingList[] = [
  {
    id: "list-1",
    name: "Weekly Groceries",
    budget_minor: 800000, // 8,000.00 KES
    currency: "KES",
    status: ShoppingListStatus.Open,
    created_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
  },
  {
    id: "list-2",
    name: "Tech & Workspace Supplies",
    budget_minor: 1500000, // 15,000.00 KES
    currency: "KES",
    status: ShoppingListStatus.Open,
    created_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
  },
  {
    id: "list-3",
    name: "Home Repairs & Garden",
    budget_minor: 2000000, // 20,000.00 KES
    currency: "KES",
    status: ShoppingListStatus.Done,
    created_at: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
  },
];

export const initialMockShoppingItems: ShoppingItem[] = [
  // List 1 items
  {
    id: "item-101",
    list_id: "list-1",
    name: "Fresh Milk 500ml",
    quantity: 4,
    unit: "pack",
    priority: 1, // High
    estimated_price_minor: 7500, // 75.00 KES each
    actual_price_minor: 7500,
    purchased: true,
    transaction_id: "tx-104",
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 86400 * 1000).toISOString(),
  },
  {
    id: "item-102",
    list_id: "list-1",
    name: "Basmati Rice 5kg",
    quantity: 1,
    unit: "bag",
    priority: 1,
    estimated_price_minor: 130000, // 1,300.00 KES
    actual_price_minor: 125000, // 1,250.00 KES
    purchased: true,
    transaction_id: "tx-104",
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 86400 * 1000).toISOString(),
  },
  {
    id: "item-103",
    list_id: "list-1",
    name: "Extra Virgin Olive Oil 1L",
    quantity: 1,
    unit: "bottle",
    priority: 2, // Medium
    estimated_price_minor: 165000, // 1,650.00 KES
    actual_price_minor: null,
    purchased: false,
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
  },
  {
    id: "item-104",
    list_id: "list-1",
    name: "Brown Eggs 30-tray",
    quantity: 1,
    unit: "tray",
    priority: 1,
    estimated_price_minor: 48000, // 480.00 KES
    actual_price_minor: null,
    purchased: false,
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
  },
  {
    id: "item-105",
    list_id: "list-1",
    name: "Organic Avocados",
    quantity: 6,
    unit: "pcs",
    priority: 3, // Low
    estimated_price_minor: 5000, // 50.00 KES each
    actual_price_minor: null,
    purchased: false,
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
  },

  // List 2 items
  {
    id: "item-201",
    list_id: "list-2",
    name: "Braided USB-C Cable 2m",
    quantity: 2,
    unit: "pcs",
    priority: 1,
    estimated_price_minor: 150000, // 1,500.00 KES
    actual_price_minor: null,
    purchased: false,
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
  },
  {
    id: "item-202",
    list_id: "list-2",
    name: "Surge Protected Power Strip 6-Way",
    quantity: 1,
    unit: "pcs",
    priority: 2,
    estimated_price_minor: 380000, // 3,800.00 KES
    actual_price_minor: null,
    purchased: false,
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
  },

  // List 3 items (Done)
  {
    id: "item-301",
    list_id: "list-3",
    name: "Water Hose Reel 25m",
    quantity: 1,
    unit: "pcs",
    priority: 1,
    estimated_price_minor: 650000,
    actual_price_minor: 620000,
    purchased: true,
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
  },
];

export const initialMockPriceHistories: PriceHistory[] = [
  // Milk price history across months and stores
  { id: "ph-1", item_key: "milk_500ml", price_minor: 6500, currency: "KES", observed_at: "2026-04-10T10:00:00Z", source: "Naivas" },
  { id: "ph-2", item_key: "milk_500ml", price_minor: 7000, currency: "KES", observed_at: "2026-06-15T14:30:00Z", source: "QuickMart" },
  { id: "ph-3", item_key: "milk_500ml", price_minor: 7000, currency: "KES", observed_at: "2026-07-20T11:00:00Z", source: "Carrefour" },
  { id: "ph-4", item_key: "milk_500ml", price_minor: 7500, currency: "KES", observed_at: "2026-08-05T09:00:00Z", source: "Naivas" },
  { id: "ph-5", item_key: "milk_500ml", price_minor: 7500, currency: "KES", observed_at: "2026-09-22T16:00:00Z", source: "Naivas" },

  // Rice price history
  { id: "ph-6", item_key: "rice_5kg", price_minor: 110000, currency: "KES", observed_at: "2026-03-01T10:00:00Z", source: "Carrefour" },
  { id: "ph-7", item_key: "rice_5kg", price_minor: 118000, currency: "KES", observed_at: "2026-05-18T10:00:00Z", source: "Naivas" },
  { id: "ph-8", item_key: "rice_5kg", price_minor: 122000, currency: "KES", observed_at: "2026-07-12T10:00:00Z", source: "QuickMart" },
  { id: "ph-9", item_key: "rice_5kg", price_minor: 125000, currency: "KES", observed_at: "2026-09-23T10:00:00Z", source: "Naivas" },

  // Olive oil
  { id: "ph-10", item_key: "olive_oil_1l", price_minor: 140000, currency: "KES", observed_at: "2026-04-10T10:00:00Z", source: "Carrefour" },
  { id: "ph-11", item_key: "olive_oil_1l", price_minor: 155000, currency: "KES", observed_at: "2026-07-01T10:00:00Z", source: "Carrefour" },
  { id: "ph-12", item_key: "olive_oil_1l", price_minor: 165000, currency: "KES", observed_at: "2026-09-20T10:00:00Z", source: "Naivas" },
];
