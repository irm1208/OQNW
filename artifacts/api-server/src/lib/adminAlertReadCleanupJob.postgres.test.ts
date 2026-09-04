import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import test from "node:test";
import pg from "pg";

const { Pool } = pg;

test("cleanup preserves live millisecond-precision events and drains bounded batches", async (t) => {
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required");
  const schema = `alert_cleanup_${randomUUID().replaceAll("-", "")}`;
  const bootstrapPool = new Pool({ connectionString: process.env.DATABASE_URL });
  const lockClient = await bootstrapPool.connect();
  let appPool: import("pg").Pool | undefined;

  t.after(async () => {
    if (appPool) await appPool.end();
    lockClient.release();
    await bootstrapPool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await bootstrapPool.end();
  });

  await bootstrapPool.query(`CREATE SCHEMA "${schema}"`);
  await bootstrapPool.query(`
    CREATE TABLE "${schema}".admin_alert_reads (
      id serial PRIMARY KEY,
      admin_user_id integer NOT NULL,
      alert_id text NOT NULL,
      alert_created_at timestamptz NOT NULL,
      read_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE "${schema}".orders (
      id serial PRIMARY KEY,
      status text NOT NULL,
      fraud_score integer NOT NULL,
      fraud_reviewed boolean NOT NULL,
      created_at timestamptz NOT NULL
    );
    CREATE TABLE "${schema}".returns (
      id serial PRIMARY KEY,
      status text NOT NULL,
      created_at timestamptz NOT NULL
    );
    CREATE TABLE "${schema}".products_inventory (
      id serial PRIMARY KEY,
      stock_level integer NOT NULL,
      low_stock_threshold integer NOT NULL,
      updated_at timestamptz NOT NULL
    );
    CREATE TABLE "${schema}".abandoned_carts (
      id serial PRIMARY KEY,
      converted_at timestamptz,
      updated_at timestamptz NOT NULL
    );
  `);

  const migrationPath = fileURLToPath(
    new URL("../../../../lib/db/migrations/0008_admin_alert_read_cleanup.sql", import.meta.url),
  );
  await bootstrapPool.query(`SET search_path TO "${schema}"`);
  await bootstrapPool.query(await readFile(migrationPath, "utf8"));

  const databaseUrl = new URL(process.env.DATABASE_URL);
  databaseUrl.searchParams.set("options", `-c search_path=${schema}`);
  process.env.DATABASE_URL = databaseUrl.toString();

  const [{ pool }, cleanup] = await Promise.all([
    import("@workspace/db"),
    import("./adminAlertReadCleanupJob"),
  ]);
  appPool = pool;

  await bootstrapPool.query(`
    WITH event_time AS (
      SELECT now() - interval '181 days' + interval '0.123456 seconds' AS value
    ),
    active_order AS (
      INSERT INTO "${schema}".orders (id, status, fraud_score, fraud_reviewed, created_at)
      SELECT 101, 'pending', 60, false, value FROM event_time
      RETURNING created_at
    ),
    active_return AS (
      INSERT INTO "${schema}".returns (id, status, created_at)
      SELECT 102, 'requested', value FROM event_time
      RETURNING created_at
    ),
    active_stock AS (
      INSERT INTO "${schema}".products_inventory (id, stock_level, low_stock_threshold, updated_at)
      SELECT 103, 1, 10, value FROM event_time
      RETURNING updated_at
    ),
    active_cart AS (
      INSERT INTO "${schema}".abandoned_carts (id, converted_at, updated_at)
      SELECT 104, NULL, value FROM event_time
      RETURNING updated_at
    )
    INSERT INTO "${schema}".admin_alert_reads
      (admin_user_id, alert_id, alert_created_at, read_at)
    SELECT 1, alert_id, date_trunc('milliseconds', event_at), now() - interval '181 days'
    FROM (
      SELECT 'order-101' AS alert_id, created_at AS event_at FROM active_order
      UNION ALL SELECT 'fraud-101', created_at FROM active_order
      UNION ALL SELECT 'return-102', created_at FROM active_return
      UNION ALL SELECT 'stock-103', updated_at FROM active_stock
      UNION ALL SELECT 'cart-104', updated_at FROM active_cart
    ) live_events;

    INSERT INTO "${schema}".admin_alert_reads
      (admin_user_id, alert_id, alert_created_at, read_at)
    SELECT 1, 'resolved-' || value, now() - interval '181 days', now() - interval '181 days'
    FROM generate_series(1, 501) AS value;

    INSERT INTO "${schema}".admin_alert_reads
      (admin_user_id, alert_id, alert_created_at, read_at)
    VALUES (1, 'young-receipt', now(), now());
  `);

  await lockClient.query("SELECT pg_advisory_lock($1)", [cleanup.ADMIN_ALERT_READ_CLEANUP_LOCK_KEY]);
  assert.equal(await cleanup.cleanupOldAdminAlertReads(), 0);
  await lockClient.query("SELECT pg_advisory_unlock($1)", [cleanup.ADMIN_ALERT_READ_CLEANUP_LOCK_KEY]);

  assert.equal(await cleanup.cleanupOldAdminAlertReads(), 501);

  const remaining = await bootstrapPool.query<{ alert_id: string }>(
    `SELECT alert_id FROM "${schema}".admin_alert_reads ORDER BY alert_id`,
  );
  assert.deepEqual(
    remaining.rows.map((row) => row.alert_id),
    ["cart-104", "fraud-101", "order-101", "return-102", "stock-103", "young-receipt"],
  );

  const index = await bootstrapPool.query(
    `SELECT 1 FROM pg_indexes
     WHERE schemaname = $1 AND indexname = 'admin_alert_reads_cleanup_idx'`,
    [schema],
  );
  assert.equal(index.rowCount, 1);
});