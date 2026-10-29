export default `
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
`;