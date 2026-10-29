import { z } from 'zod';
import { ShoppingListStatus } from '../enums';

export const shoppingListSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  name: z.string().min(1).max(100),
  budget_minor: z.number().int().nonnegative().nullable().optional(),
  currency: z.string().min(3).max(3).default('KES'),
  status: z.nativeEnum(ShoppingListStatus).default(ShoppingListStatus.Open),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const shoppingItemSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  list_id: z.string().uuid().or(z.string().min(1)),
  name: z.string().min(1).max(200),
  quantity: z.number().positive().default(1),
  unit: z.string().nullable().optional(),
  priority: z.number().int().min(0).max(3).default(0),
  estimated_price_minor: z.number().int().nonnegative().nullable().optional(),
  actual_price_minor: z.number().int().nonnegative().nullable().optional(),
  purchased: z.boolean().default(false),
  transaction_id: z.string().nullable().optional(),
  sync_state: z.string().optional(),
  version: z.number().int().positive().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const createShoppingListSchema = shoppingListSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const createShoppingItemSchema = shoppingItemSchema.omit({
  id: true,
  sync_state: true,
  version: true,
  created_at: true,
  updated_at: true,
});

export type ShoppingListInput = z.infer<typeof createShoppingListSchema>;
export type ShoppingItemInput = z.infer<typeof createShoppingItemSchema>;
