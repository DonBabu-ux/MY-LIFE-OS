import { z } from 'zod';
import { CategoryKind } from '../enums';

export const categorySchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  name: z.string().min(1).max(100),
  kind: z.nativeEnum(CategoryKind),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  is_system: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const createCategorySchema = categorySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type CategoryInput = z.infer<typeof createCategorySchema>;
