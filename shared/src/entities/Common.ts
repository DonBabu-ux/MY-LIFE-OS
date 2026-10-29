import { SyncState } from '../enums';

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface SyncableEntity extends BaseEntity {
  sync_state: SyncState;
  version: number;
  deleted_at?: string | null;
}
