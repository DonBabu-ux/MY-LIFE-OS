import { z } from 'zod';
import { SyncOp } from '../enums';

export const syncEnvelopeSchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  op: z.nativeEnum(SyncOp),
  version: z.number().int().positive(),
  updatedAt: z.string(),
  payload: z.record(z.unknown()),
  deviceId: z.string().min(1),
  signature: z.string().nullable().optional(),
});

export const syncPushSchema = z.object({
  deviceId: z.string().min(1),
  userId: z.string().min(1),
  items: z.array(syncEnvelopeSchema),
});

export const syncPullSchema = z.object({
  since: z.string().optional(),
  types: z.array(z.string()).optional(),
  cursor: z.string().optional(),
});

export const syncResolveSchema = z.object({
  conflictId: z.string().min(1),
  choice: z.enum(['local', 'remote', 'merged']),
  mergedPayload: z.record(z.unknown()).optional(),
});
