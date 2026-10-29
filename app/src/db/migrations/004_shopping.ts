export default `
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
`;