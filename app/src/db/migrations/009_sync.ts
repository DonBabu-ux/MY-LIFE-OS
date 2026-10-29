export default `
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
`;