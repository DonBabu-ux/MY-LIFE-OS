import { SyncableEntity } from './Common';

export interface TaskRecurrence {
  task_id: string;
  rule: string; // RFC 5545 RRULE
  next_run_at: string;
}

export interface Reminder {
  id: string;
  task_id?: string | null;
  fire_at: string;
  notification_id?: number | null;
  fired: boolean;
}

export interface Task extends SyncableEntity {
  title: string;
  notes?: string | null;
  priority: number; // 0: low, 1: medium, 2: high, 3: urgent
  due_at?: string | null;
  planned_start?: string | null;
  planned_end?: string | null;
  completed: boolean;
  completed_at?: string | null;
  parent_task_id?: string | null;
  recurrence?: TaskRecurrence | null;
  reminders?: Reminder[];
}
