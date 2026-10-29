import { SyncConflict } from '../entities/SyncRecord';
import { SyncEnvelope } from '../sync/SyncEnvelope';

export interface SyncPushDto {
  deviceId: string;
  userId: string;
  items: SyncEnvelope[];
}

export interface SyncPushResponseDto {
  accepted: string[];
  conflicts: SyncConflict[];
}

export interface SyncPullDto {
  since?: string;
  types?: string[];
  cursor?: string;
}

export interface SyncPullResponseDto {
  items: SyncEnvelope[];
  nextCursor?: string | null;
  serverTime: string;
}

export interface SyncResolveDto {
  conflictId: string;
  choice: 'local' | 'remote' | 'merged';
  mergedPayload?: Record<string, unknown>;
}

export interface SyncResolveResponseDto {
  ok: boolean;
}
