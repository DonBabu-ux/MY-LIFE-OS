import { z } from 'zod';
import { ReceiptSource } from '../enums';

export const receiptItemSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  receipt_id: z.string(),
  name: z.string().min(1),
  quantity: z.number().positive().nullable().optional(),
  unit_price_minor: z.number().int().nonnegative().nullable().optional(),
});

export const receiptSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  file_path: z.string().min(1),
  mime: z.string().min(1),
  source: z.nativeEnum(ReceiptSource),
  merchant: z.string().nullable().optional(),
  amount_minor: z.number().int().nonnegative().nullable().optional(),
  currency: z.string().min(3).max(3).nullable().optional(),
  occurred_at: z.string().nullable().optional(),
  extracted_text: z.string().nullable().optional(),
  category_id: z.string().nullable().optional(),
  dedup_hash: z.string().nullable().optional(),
  sync_state: z.string().optional(),
  version: z.number().int().positive().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  items: z.array(receiptItemSchema).optional(),
});

export const createReceiptSchema = receiptSchema.omit({
  id: true,
  sync_state: true,
  version: true,
  created_at: true,
  updated_at: true,
});

export type ReceiptInput = z.infer<typeof createReceiptSchema>;
