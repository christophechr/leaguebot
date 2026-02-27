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
      id INTEGER PRIMARY KEY,
      count INTEGER NOT NULL
    )
  `);

  await pool.query(`
    INSERT INTO drooler_counter (id, count)
    VALUES (1, 0)
    ON CONFLICT (id) DO NOTHING
  `);
}

export async function getRulerCaughtCount() {
  const result = await pool.query("SELECT count FROM drooler_counter WHERE id = 1");
  if (result.rowCount === 0) return 0;
  return result.rows[0].count as number;
}

export async function incrementRulerCaughtCount() {
  const result = await pool.query(
    "UPDATE drooler_counter SET count = count + 1 WHERE id = 1 RETURNING count"
  );
  if (result.rowCount === 0) return 0;
  return result.rows[0].count as number;
}
