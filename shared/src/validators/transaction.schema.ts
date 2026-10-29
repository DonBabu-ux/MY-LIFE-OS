import { z } from 'zod';
import { SourceType, TransactionType } from '../enums';

export const transactionSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  type: z.nativeEnum(TransactionType),
  amount_minor: z.number().int(),
  currency: z.string().min(3).max(3).default('KES'),
  occurred_at: z.string().datetime({ offset: true }).or(z.string()),
  merchant: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category_id: z.string().nullable().optional(),
  source: z.nativeEnum(SourceType),
  receipt_id: z.string().nullable().optional(),
  sync_state: z.string().optional(),
  version: z.number().int().positive().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_at: z.string().nullable().optional(),
});

export const createTransactionSchema = transactionSchema.omit({
  id: true,
  sync_state: true,
  version: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export type TransactionInput = z.infer<typeof createTransactionSchema>;
