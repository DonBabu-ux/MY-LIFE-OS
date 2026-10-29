export default `
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
`;