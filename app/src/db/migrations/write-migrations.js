const fs = require('fs');
const path = require('path');

const migrations = [
  {
    name: '001_init.ts',
    content: `export default \`
CREATE TABLE sync_meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
\`;`
  },
  {
    name: '002_finance.ts',
    content: `export default \`
CREATE TABLE categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('income','expense','transfer')),
  icon        TEXT,
  color       TEXT,
  is_system   INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE TABLE transactions (
  id            TEXT PRIMARY KEY,
  type          TEXT NOT NULL CHECK (type IN ('income','expense','transfer','withdrawal')),
  amount_minor  INTEGER NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'KES',
  occurred_at   TEXT NOT NULL,
  merchant      TEXT,
  reference     TEXT,
  description   TEXT,
  category_id   TEXT REFERENCES categories(id),
  source        TEXT NOT NULL CHECK (source IN ('manual','sms','receipt','import')),
  receipt_id    TEXT,
  sync_state    TEXT NOT NULL DEFAULT 'local_only',
  version       INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  deleted_at    TEXT
);
CREATE INDEX idx_tx_occurred ON transactions(occurred_at DESC);
CREATE INDEX idx_tx_category ON transactions(category_id);
CREATE INDEX idx_tx_sync     ON transactions(sync_state);

CREATE TABLE recurring_rules (
  id            TEXT PRIMARY KEY,
  merchant      TEXT,
  amount_minor  INTEGER,
  period        TEXT NOT NULL CHECK (period IN ('daily','weekly','monthly','yearly')),
  next_run_at   TEXT NOT NULL,
  last_seen_at  TEXT,
  confidence    REAL NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL
);
\`;`
  },
  {
    name: '003_receipts.ts',
    content: `export default \`
CREATE TABLE receipts (
  id            TEXT PRIMARY KEY,
  file_path     TEXT NOT NULL,
  mime          TEXT NOT NULL,
  source        TEXT NOT NULL CHECK (source IN ('camera','import','share')),
  merchant      TEXT,
  amount_minor  INTEGER,
  currency      TEXT,
  occurred_at   TEXT,
  extracted_text TEXT,
  category_id   TEXT REFERENCES categories(id),
  dedup_hash    TEXT UNIQUE,
  sync_state    TEXT NOT NULL DEFAULT 'local_only',
  version       INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX idx_receipts_dedup ON receipts(dedup_hash);

CREATE TABLE receipt_items (
  id           TEXT PRIMARY KEY,
  receipt_id   TEXT NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  quantity     REAL,
  unit_price_minor INTEGER
);
\`;`
  },
  {
    name: '004_shopping.ts',
    content: `export default \`
CREATE TABLE shopping_lists (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  budget_minor  INTEGER,
  currency      TEXT NOT NULL DEFAULT 'KES',
  status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','done','archived')),
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

CREATE TABLE shopping_items (
  id                  TEXT PRIMARY KEY,
  list_id             TEXT NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  quantity            REAL NOT NULL DEFAULT 1,
  unit                TEXT,
  priority            INTEGER NOT NULL DEFAULT 0,
  estimated_price_minor INTEGER,
  actual_price_minor  INTEGER,
  purchased           INTEGER NOT NULL DEFAULT 0,
  transaction_id      TEXT REFERENCES transactions(id),
  sync_state          TEXT NOT NULL DEFAULT 'local_only',
  version             INTEGER NOT NULL DEFAULT 1,
  created_at          TEXT NOT NULL,
  updated_at          TEXT NOT NULL
);

CREATE TABLE price_history (
  id              TEXT PRIMARY KEY,
  item_key        TEXT NOT NULL,
  price_minor     INTEGER NOT NULL,
  currency        TEXT NOT NULL,
  observed_at     TEXT NOT NULL,
  source          TEXT NOT NULL
);
CREATE INDEX idx_price_key ON price_history(item_key, observed_at DESC);
\`;`
  },
  {
    name: '005_notes_diary.ts',
    content: `export default \`
CREATE TABLE notes (
  id           TEXT PRIMARY KEY,
  title        TEXT,
  body         TEXT NOT NULL DEFAULT '',
  folder       TEXT,
  is_favorite  INTEGER NOT NULL DEFAULT 0,
  sync_state   TEXT NOT NULL DEFAULT 'local_only',
  version      INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT
);
CREATE VIRTUAL TABLE notes_fts USING fts5(title, body, content='notes', content_rowid='id');

CREATE TABLE note_tags (
  note_id  TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag      TEXT NOT NULL,
  PRIMARY KEY (note_id, tag)
);

CREATE TABLE diary_entries (
  id           TEXT PRIMARY KEY,
  entry_date   TEXT NOT NULL,
  title        TEXT,
  text         TEXT NOT NULL DEFAULT '',
  mood         TEXT,
  is_private   INTEGER NOT NULL DEFAULT 0,
  sync_state   TEXT NOT NULL DEFAULT 'local_only',
  version      INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);
CREATE INDEX idx_diary_date ON diary_entries(entry_date DESC);

CREATE TABLE media_attachments (
  id           TEXT PRIMARY KEY,
  parent_type  TEXT NOT NULL CHECK (parent_type IN ('note','diary','receipt','shopping')),
  parent_id    TEXT NOT NULL,
  kind         TEXT NOT NULL CHECK (kind IN ('image','video','audio','pdf','other')),
  local_path   TEXT NOT NULL,
  duration_ms  INTEGER,
  size_bytes   INTEGER NOT NULL,
  mime         TEXT NOT NULL,
  created_at   TEXT NOT NULL
);
CREATE INDEX idx_media_parent ON media_attachments(parent_type, parent_id);
\`;`
  },
  {
    name: '006_planner.ts',
    content: `export default \`
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
\`;`
  },
  {
    name: '007_usage_activity.ts',
    content: `export default \`
CREATE TABLE app_usage (
  id            TEXT PRIMARY KEY,
  package_name  TEXT NOT NULL,
  bucket_date   TEXT NOT NULL,
  duration_ms   INTEGER NOT NULL DEFAULT 0,
  launches      INTEGER NOT NULL DEFAULT 0,
  category      TEXT,
  UNIQUE(package_name, bucket_date)
);

CREATE TABLE activity_records (
  id             TEXT PRIMARY KEY,
  bucket_date    TEXT NOT NULL UNIQUE,
  steps          INTEGER NOT NULL DEFAULT 0,
  distance_m     REAL NOT NULL DEFAULT 0,
  active_ms      INTEGER NOT NULL DEFAULT 0
);
\`;`
  },
  {
    name: '008_contacts.ts',
    content: `export default \`
CREATE TABLE contact_snapshots (
  id           TEXT PRIMARY KEY,
  contact_id   TEXT NOT NULL,
  display_name TEXT NOT NULL,
  phones_json  TEXT NOT NULL DEFAULT '[]',
  emails_json  TEXT NOT NULL DEFAULT '[]',
  labels_json  TEXT NOT NULL DEFAULT '[]',
  last_seen_at TEXT NOT NULL
);
CREATE INDEX idx_contact_name ON contact_snapshots(display_name);
\`;`
  },
  {
    name: '009_sync.ts',
    content: `export default \`
CREATE TABLE sync_records (
  id            TEXT PRIMARY KEY,
  entity_type   TEXT NOT NULL,
  entity_id     TEXT NOT NULL,
  op            TEXT NOT NULL CHECK (op IN ('upsert','delete')),
  payload_json  TEXT NOT NULL,
  sync_state    TEXT NOT NULL DEFAULT 'pending_sync',
  attempts      INTEGER NOT NULL DEFAULT 0,
  last_error    TEXT,
  next_attempt_at TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  UNIQUE(entity_type, entity_id)
);
CREATE INDEX idx_sync_state ON sync_records(sync_state, next_attempt_at);

CREATE TABLE sync_conflicts (
  id            TEXT PRIMARY KEY,
  entity_type   TEXT NOT NULL,
  entity_id     TEXT NOT NULL,
  local_json    TEXT NOT NULL,
  remote_json   TEXT NOT NULL,
  detected_at   TEXT NOT NULL,
  resolved      INTEGER NOT NULL DEFAULT 0,
  resolution    TEXT
);
\`;`
  },
  {
    name: 'index.ts',
    content: `import m001 from './001_init';
import m002 from './002_finance';
import m003 from './003_receipts';
import m004 from './004_shopping';
import m005 from './005_notes_diary';
import m006 from './006_planner';
import m007 from './007_usage_activity';
import m008 from './008_contacts';
import m009 from './009_sync';

export const migrations = [
  { id: 1, sql: m001 },
  { id: 2, sql: m002 },
  { id: 3, sql: m003 },
  { id: 4, sql: m004 },
  { id: 5, sql: m005 },
  { id: 6, sql: m006 },
  { id: 7, sql: m007 },
  { id: 8, sql: m008 },
  { id: 9, sql: m009 },
];
`
  }
];

migrations.forEach(m => {
  fs.writeFileSync(path.join(__dirname, m.name), m.content);
});
