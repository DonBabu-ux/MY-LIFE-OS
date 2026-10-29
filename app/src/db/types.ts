export type SyncState = 'local_only' | 'pending_sync' | 'synced' | 'conflict';

export interface BaseRow {
  id: string;
  sync_state: SyncState;
  version: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SettingsRow {
  key: string;
  value: string;
}

export interface SyncMetaRow {
  key: string;
  value: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  kind: 'income' | 'expense' | 'transfer';
  icon?: string | null;
  color?: string | null;
  is_system: number; // 0 or 1
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionRow extends BaseRow {
  type: 'income' | 'expense' | 'transfer' | 'withdrawal';
  amount_minor: number;
  currency: string;
  occurred_at: string;
  merchant?: string | null;
  reference?: string | null;
  description?: string | null;
  category_id?: string | null;
  source: 'manual' | 'sms' | 'receipt' | 'import';
  receipt_id?: string | null;
}

export interface RecurringRuleRow {
  id: string;
  merchant?: string | null;
  amount_minor?: number | null;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_run_at: string;
  last_seen_at?: string | null;
  confidence: number;
  created_at: string;
}

export interface ReceiptRow extends BaseRow {
  file_path: string;
  mime: string;
  source: 'camera' | 'import' | 'share';
  merchant?: string | null;
  amount_minor?: number | null;
  currency?: string | null;
  occurred_at?: string | null;
  extracted_text?: string | null;
  category_id?: string | null;
  dedup_hash?: string | null;
}

export interface ReceiptItemRow {
  id: string;
  receipt_id: string;
  name: string;
  quantity?: number | null;
  unit_price_minor?: number | null;
}

export interface ShoppingListRow {
  id: string;
  name: string;
  budget_minor?: number | null;
  currency: string;
  status: 'open' | 'done' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ShoppingItemRow extends BaseRow {
  list_id: string;
  name: string;
  quantity: number;
  unit?: string | null;
  priority: number;
  estimated_price_minor?: number | null;
  actual_price_minor?: number | null;
  purchased: number;
  transaction_id?: string | null;
}

export interface PriceHistoryRow {
  id: string;
  item_key: string;
  price_minor: number;
  currency: string;
  observed_at: string;
  source: string;
}

export interface NoteRow extends BaseRow {
  title?: string | null;
  body: string;
  folder?: string | null;
  is_favorite: number;
}

export interface NoteTagRow {
  note_id: string;
  tag: string;
}

export interface DiaryEntryRow extends Omit<BaseRow, 'deleted_at'> {
  entry_date: string;
  title?: string | null;
  text: string;
  mood?: string | null;
  is_private: number;
}

export interface MediaAttachmentRow {
  id: string;
  parent_type: 'note' | 'diary' | 'receipt' | 'shopping';
  parent_id: string;
  kind: 'image' | 'video' | 'audio' | 'pdf' | 'other';
  local_path: string;
  duration_ms?: number | null;
  size_bytes: number;
  mime: string;
  created_at: string;
}

export interface TaskRow extends BaseRow {
  title: string;
  notes?: string | null;
  priority: number;
  due_at?: string | null;
  planned_start?: string | null;
  planned_end?: string | null;
  completed: number;
  completed_at?: string | null;
  parent_task_id?: string | null;
}

export interface TaskRecurrenceRow {
  task_id: string;
  rule: string;
  next_run_at: string;
}

export interface ReminderRow {
  id: string;
  task_id?: string | null;
  fire_at: string;
  notification_id?: number | null;
  fired: number;
}

export interface AppUsageRow {
  id: string;
  package_name: string;
  bucket_date: string;
  duration_ms: number;
  launches: number;
  category?: string | null;
}

export interface ActivityRecordRow {
  id: string;
  bucket_date: string;
  steps: number;
  distance_m: number;
  active_ms: number;
}

export interface ContactSnapshotRow {
  id: string;
  contact_id: string;
  display_name: string;
  phones_json: string;
  emails_json: string;
  labels_json: string;
  last_seen_at: string;
}

export interface SyncRecordRow {
  id: string;
  entity_type: string;
  entity_id: string;
  op: 'upsert' | 'delete';
  payload_json: string;
  sync_state: string;
  attempts: number;
  last_error?: string | null;
  next_attempt_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SyncConflictRow {
  id: string;
  entity_type: string;
  entity_id: string;
  local_json: string;
  remote_json: string;
  detected_at: string;
  resolved: number;
  resolution?: string | null;
}
