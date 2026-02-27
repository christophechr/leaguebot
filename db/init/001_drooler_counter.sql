CREATE TABLE IF NOT EXISTS drooler_counter (
  split TEXT NOT NULL,
  year INTEGER NOT NULL,
  team TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL
  ,
  PRIMARY KEY (split, year, team)
);
