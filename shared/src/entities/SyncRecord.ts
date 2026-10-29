import { SyncOp, SyncState } from '../enums';
import { BaseEntity } from './Common';

export interface SyncRecord extends BaseEntity {
  entity_type: string;
  entity_id: string;
  op: SyncOp;
  payload: Record<string, unknown>;
  sync_state: SyncState;
  attempts: number;
  last_error?: string | null;
  next_attempt_at?: string | null;
}

export interface SyncConflict {
  id: string;
  entity_type: string;
  entity_id: string;
  local_payload: Record<string, unknown>;
  remote_payload: Record<string, unknown>;
  detected_at: string;
  resolved: boolean;
  resolution?: 'local' | 'remote' | 'merged' | null;
}
