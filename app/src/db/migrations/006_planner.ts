export default `
CREATE TABLE tasks (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  notes         TEXT,
  priority      INTEGER NOT NULL DEFAULT 1,
  due_at        TEXT,
  planned_start TEXT,
  planned_end   TEXT,
  completed     INTEGER NOT NULL DEFAULT 0,
  completed_at  TEXT,
  parent_task_id TEXT REFERENCES tasks(id),
  sync_state    TEXT NOT NULL DEFAULT 'local_only',
  version       INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX idx_tasks_due ON tasks(due_at) WHERE completed = 0;

CREATE TABLE task_recurrence (
  task_id     TEXT PRIMARY KEY REFERENCES tasks(id) ON DELETE CASCADE,
  rule        TEXT NOT NULL,
  next_run_at TEXT NOT NULL
);

CREATE TABLE reminders (
  id           TEXT PRIMARY KEY,
  task_id      TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  fire_at      TEXT NOT NULL,
  notification_id INTEGER,
  fired        INTEGER NOT NULL DEFAULT 0
);
`;