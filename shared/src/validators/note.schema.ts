import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  title: z.string().nullable().optional(),
  body: z.string().default(''),
  folder: z.string().nullable().optional(),
  is_favorite: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  sync_state: z.string().optional(),
  version: z.number().int().positive().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_at: z.string().nullable().optional(),
});

export const createNoteSchema = noteSchema.omit({
  id: true,
  sync_state: true,
  version: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export type NoteInput = z.infer<typeof createNoteSchema>;
