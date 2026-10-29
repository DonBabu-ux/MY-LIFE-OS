export default `
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
`;