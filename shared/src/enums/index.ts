// ── Transaction Types ────────────────────────
export const TransactionType = {
  Income: "income",
  Expense: "expense",
  Transfer: "transfer",
  Withdrawal: "withdrawal",
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

// ── Source Types ─────────────────────────────
export const SourceType = {
  Manual: "manual",
  Sms: "sms",
  Receipt: "receipt",
  Import: "import",
} as const;
export type SourceType = (typeof SourceType)[keyof typeof SourceType];

// ── Receipt Source ──────────────────────────
export const ReceiptSource = {
  Camera: "camera",
  Import: "import",
  Share: "share",
} as const;
export type ReceiptSource = (typeof ReceiptSource)[keyof typeof ReceiptSource];

// ── Category Kind ───────────────────────────
export const CategoryKind = {
  Income: "income",
  Expense: "expense",
  Transfer: "transfer",
} as const;
export type CategoryKind = (typeof CategoryKind)[keyof typeof CategoryKind];

// ── Recurring Period ────────────────────────
export const RecurringPeriod = {
  Daily: "daily",
  Weekly: "weekly",
  Monthly: "monthly",
  Yearly: "yearly",
} as const;
export type RecurringPeriod = (typeof RecurringPeriod)[keyof typeof RecurringPeriod];

// ── Shopping List Status ────────────────────
export const ShoppingListStatus = {
  Open: "open",
  Done: "done",
  Archived: "archived",
} as const;
export type ShoppingListStatus = (typeof ShoppingListStatus)[keyof typeof ShoppingListStatus];

// ── Media Kind ──────────────────────────────
export const MediaKind = {
  Image: "image",
  Video: "video",
  Audio: "audio",
  Pdf: "pdf",
  Other: "other",
} as const;
export type MediaKind = (typeof MediaKind)[keyof typeof MediaKind];

// ── Parent Type (media attachments) ─────────
export const ParentType = {
  Note: "note",
  Diary: "diary",
  Receipt: "receipt",
  Shopping: "shopping",
} as const;
export type ParentType = (typeof ParentType)[keyof typeof ParentType];

// ── Sync State ──────────────────────────────
export const SyncState = {
  LocalOnly: "local_only",
  PendingSync: "pending_sync",
  Synced: "synced",
  Conflict: "conflict",
} as const;
export type SyncState = (typeof SyncState)[keyof typeof SyncState];

// ── Sync Operation ──────────────────────────
export const SyncOp = {
  Upsert: "upsert",
  Delete: "delete",
} as const;
export type SyncOp = (typeof SyncOp)[keyof typeof SyncOp];

// ── Permission Status ───────────────────────
export const PermissionStatus = {
  Granted: "granted",
  Denied: "denied",
  Blocked: "blocked",
  Unavailable: "unavailable",
  Limited: "limited",
} as const;
export type PermissionStatus = (typeof PermissionStatus)[keyof typeof PermissionStatus];
