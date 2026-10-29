export const DEFAULT_CURRENCY = 'KES';

export const APP_ID = 'com.mylifeos';

export const SYNC_CONSTANTS = {
  MAX_PUSH_BATCH_SIZE: 500,
  DEFAULT_PULL_LIMIT: 500,
  INITIAL_BACKOFF_MS: 1000,
  MAX_BACKOFF_MS: 60000,
  BACKOFF_MULTIPLIER: 2,
  MAX_RETRY_ATTEMPTS: 5,
};

export const SYNCABLE_ENTITY_TYPES = [
  'transaction',
  'category',
  'receipt',
  'shopping_item',
  'shopping_list',
  'note',
  'diary_entry',
  'task',
  'app_usage',
  'activity_record',
] as const;

export type SyncableEntityType = (typeof SYNCABLE_ENTITY_TYPES)[number];
