import { SyncOp } from '../enums';

export interface SyncEnvelope<T = Record<string, unknown>> {
  entityType: string;
  entityId: string;
  op: SyncOp;
  version: number;
  updatedAt: string;
  payload: T;
  deviceId: string;
  signature?: string | null;
}
