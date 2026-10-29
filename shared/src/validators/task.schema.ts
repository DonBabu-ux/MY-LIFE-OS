import { z } from 'zod';

export const taskRecurrenceSchema = z.object({
  task_id: z.string(),
  rule: z.string().min(1),
  next_run_at: z.string(),
});

export const reminderSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  task_id: z.string().nullable().optional(),
  fire_at: z.string(),
  notification_id: z.number().int().nullable().optional(),
  fired: z.boolean().default(false),
});

export const taskSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  title: z.string().min(1).max(300),
  notes: z.string().nullable().optional(),
  priority: z.number().int().min(0).max(3).default(1),
  due_at: z.string().nullable().optional(),
  planned_start: z.string().nullable().optional(),
  planned_end: z.string().nullable().optional(),
  completed: z.boolean().default(false),
  completed_at: z.string().nullable().optional(),
  parent_task_id: z.string().nullable().optional(),
  sync_state: z.string().optional(),
  version: z.number().int().positive().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  recurrence: taskRecurrenceSchema.nullable().optional(),
  reminders: z.array(reminderSchema).optional(),
});

export const createTaskSchema = taskSchema.omit({
  id: true,
  sync_state: true,
  version: true,
  created_at: true,
  updated_at: true,
});

export type TaskInput = z.infer<typeof createTaskSchema>;
