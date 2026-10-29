import { z } from 'zod';

export const diaryEntrySchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  entry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  title: z.string().nullable().optional(),
  text: z.string().default(''),
  mood: z.string().nullable().optional(),
  is_private: z.boolean().default(false),
  sync_state: z.string().optional(),
  version: z.number().int().positive().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const createDiaryEntrySchema = diaryEntrySchema.omit({
  id: true,
  sync_state: true,
  version: true,
  created_at: true,
  updated_at: true,
});

export type DiaryEntryInput = z.infer<typeof createDiaryEntrySchema>;
