import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL in .env");
}

const sslEnabled = process.env.PGSSL === "true";

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: sslEnabled ? { rejectUnauthorized: false } : undefined
});

export async function ensureDroolerTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS drooler_counter (
      split TEXT NOT NULL,
      year INTEGER NOT NULL,
      team TEXT NOT NULL DEFAULT '',
      count INTEGER NOT NULL,
      PRIMARY KEY (split, year, team)
    )
  `);

  await pool.query(`
    ALTER TABLE drooler_counter
    ALTER COLUMN team SET DEFAULT ''
  `);
  await pool.query(`UPDATE drooler_counter SET team = '' WHERE team IS NULL`);
  await pool.query(`
    ALTER TABLE drooler_counter
    ALTER COLUMN team SET NOT NULL
  `);
}

export async function getRulerCaughtCount(split: string, year: number, team?: string | null) {
  const result = await pool.query(
    `
      SELECT count
      FROM drooler_counter
      WHERE split = $1 AND year = $2 AND team = $3
    `,
    [split, year, team ?? ""]
  );
  if (result.rowCount === 0) return 0;
  return result.rows[0].count as number;
}

export async function incrementRulerCaughtCount(
  split: string,
  year: number,
  team?: string | null,
  amount = 1
) {
  const result = await pool.query(
    `
      INSERT INTO drooler_counter (split, year, team, count)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (split, year, team)
      DO UPDATE SET count = drooler_counter.count + EXCLUDED.count
      RETURNING count
    `,
    [split, year, team ?? "", amount]
  );
  if (result.rowCount === 0) return 0;
  return result.rows[0].count as number;
}

export async function getRulerCaughtCountForYear(year: number, team?: string | null) {
  const result = await pool.query(
    `
      SELECT COALESCE(SUM(count), 0) AS count
      FROM drooler_counter
      WHERE year = $1 AND team = $2
    `,
    [year, team ?? ""]
  );
  return (result.rows[0]?.count as number) ?? 0;
}
