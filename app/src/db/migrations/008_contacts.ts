export default `
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
`;