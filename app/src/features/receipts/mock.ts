import { ReceiptSource } from "@shared/enums";
import type { Receipt } from "@shared/entities";

export const initialMockReceipts: Receipt[] = [
  {
    id: "rec-101",
    file_path: "file:///data/user/0/com.mylifeos.app/files/receipts/rec-101.jpg",
    mime: "image/jpeg",
    source: ReceiptSource.Camera,
    merchant: "Naivas Supermarket",
    amount_minor: 485000, // 4,850.00 KES
    currency: "KES",
    occurred_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    category_id: "cat-2", // Groceries
    extracted_text: `NAIVAS SUPERMARKET LTD
KILIMANI BRANCH - NAIROBI
PIN: P051123456Z
--------------------------------
1x Fresh Milk 500ml      75.00
2x White Bread 400g     140.00
1x Basmati Rice 5kg    1,250.00
1x Olive Oil 1L        1,650.00
1x Household Detergent 1,735.00
--------------------------------
SUBTOTAL               4,850.00
TAX 16%                  668.96
TOTAL                  4,850.00
CASH TENDERED          5,000.00
CHANGE                   150.00
THANK YOU FOR SHOPPING WITH US!`,
    dedup_hash: "hash_naivas_485000_20260923",
    items: [
      { id: "item-1", receipt_id: "rec-101", name: "Fresh Milk 500ml", quantity: 1, unit_price_minor: 7500 },
      { id: "item-2", receipt_id: "rec-101", name: "White Bread 400g", quantity: 2, unit_price_minor: 7000 },
      { id: "item-3", receipt_id: "rec-101", name: "Basmati Rice 5kg", quantity: 1, unit_price_minor: 125000 },
      { id: "item-4", receipt_id: "rec-101", name: "Olive Oil 1L", quantity: 1, unit_price_minor: 165000 },
      { id: "item-5", receipt_id: "rec-101", name: "Household Detergent", quantity: 1, unit_price_minor: 173500 },
    ],
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
  },
  {
    id: "rec-102",
    file_path: "file:///data/user/0/com.mylifeos.app/files/receipts/rec-102.jpg",
    mime: "image/jpeg",
    source: ReceiptSource.Camera,
    merchant: "Java House",
    amount_minor: 85000, // 850.00 KES
    currency: "KES",
    occurred_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    category_id: "cat-1", // Food & Dining
    extracted_text: `JAVA HOUSE CAFE
VALLEY ARCADE
TEL: 0700-112233
--------------------------------
1x Single Caffe Mocha    380.00
1x Grilled Chicken Panini 470.00
--------------------------------
TOTAL (INCL VAT)        850.00
PAID VIA M-PESA         850.00
TRANS ID: QA88912389
SERVED BY: GRACE`,
    dedup_hash: "hash_java_85000_20260924",
    items: [
      { id: "item-6", receipt_id: "rec-102", name: "Single Caffe Mocha", quantity: 1, unit_price_minor: 38000 },
      { id: "item-7", receipt_id: "rec-102", name: "Grilled Chicken Panini", quantity: 1, unit_price_minor: 47000 },
    ],
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "rec-103",
    file_path: "file:///data/user/0/com.mylifeos.app/files/receipts/rec-103.jpg",
    mime: "image/jpeg",
    source: ReceiptSource.Import,
    merchant: "Total Energies",
    amount_minor: 240000, // 2,400.00 KES
    currency: "KES",
    occurred_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    category_id: "cat-3", // Transport & Fuel
    extracted_text: `TOTAL ENERGIES STN 42
NGONG ROAD
--------------------------------
EXCELLIUM PETROL
VOLUME: 11.21 L @ 214.10 KES
TOTAL AMOUNT: KES 2,400.00
PUMP #04
ATTENDANT: JOHN K.`,
    dedup_hash: "hash_total_240000_20260924_a",
    items: [
      { id: "item-8", receipt_id: "rec-103", name: "Excellium Petrol 11.21L", quantity: 1, unit_price_minor: 240000 },
    ],
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: "rec-104",
    file_path: "file:///data/user/0/com.mylifeos.app/files/receipts/rec-104.jpg",
    mime: "image/jpeg",
    source: ReceiptSource.Share,
    merchant: "Total Energies",
    amount_minor: 240000, // 2,400.00 KES - Duplicate candidate for rec-103!
    currency: "KES",
    occurred_at: new Date(Date.now() - 6 * 3600 * 1000 + 4 * 60 * 1000).toISOString(),
    category_id: "cat-3", // Transport & Fuel
    extracted_text: `TOTAL ENERGIES STN 42
NGONG ROAD
--------------------------------
EXCELLIUM PETROL
VOLUME: 11.21 L @ 214.10 KES
TOTAL AMOUNT: KES 2,400.00
PUMP #04 - DUPLICATE SLIP`,
    dedup_hash: "hash_total_240000_20260924_b",
    items: [
      { id: "item-9", receipt_id: "rec-104", name: "Excellium Petrol 11.21L", quantity: 1, unit_price_minor: 240000 },
    ],
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 6 * 3600 * 1000 + 4 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600 * 1000 + 4 * 60 * 1000).toISOString(),
  },
  {
    id: "rec-105",
    file_path: "file:///data/user/0/com.mylifeos.app/files/receipts/rec-105.pdf",
    mime: "application/pdf",
    source: ReceiptSource.Import,
    merchant: "Goodlife Pharmacy",
    amount_minor: 145000, // 1,450.00 KES
    currency: "KES",
    occurred_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    category_id: "cat-6", // Health & Pharmacy
    extracted_text: `GOODLIFE PHARMACY
WESTGATE MALL
--------------------------------
1x Vitamin C 1000mg      650.00
1x Paracetamol Extra     300.00
1x Antiseptic Wipes      500.00
--------------------------------
TOTAL                   1,450.00`,
    dedup_hash: "hash_goodlife_145000_20260922",
    items: [
      { id: "item-10", receipt_id: "rec-105", name: "Vitamin C 1000mg", quantity: 1, unit_price_minor: 65000 },
      { id: "item-11", receipt_id: "rec-105", name: "Paracetamol Extra", quantity: 1, unit_price_minor: 30000 },
      { id: "item-12", receipt_id: "rec-105", name: "Antiseptic Wipes", quantity: 1, unit_price_minor: 50000 },
    ],
    sync_state: "local_only",
    version: 1,
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

export type DuplicateCandidate = {
  id: string;
  receiptA: Receipt;
  receiptB: Receipt;
  similarityScore: number;
  reason: string;
};

export const initialMockDuplicate: DuplicateCandidate = {
  id: "dup-1",
  receiptA: initialMockReceipts[2], // rec-103 Total Energies
  receiptB: initialMockReceipts[3], // rec-104 Total Energies (Duplicate slip)
  similarityScore: 0.98,
  reason: "Identical merchant ('Total Energies') and amount (KES 2,400.00) scanned within 4 minutes.",
};
