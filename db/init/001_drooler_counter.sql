CREATE TABLE IF NOT EXISTS drooler_counter (
  id INTEGER PRIMARY KEY,
  count INTEGER NOT NULL
);

INSERT INTO drooler_counter (id, count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
