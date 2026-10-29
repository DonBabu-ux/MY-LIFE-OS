export default `
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
`;