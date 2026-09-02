import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import type { AddressInfo } from "node:net";
import test from "node:test";
import pg from "pg";
import { and, eq } from "drizzle-orm";

const { Pool } = pg;

test("concurrent HTTP removals preserve one active owner in PostgreSQL", async (t) => {
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required");
  const schema = `owner_lockout_${randomUUID().replaceAll("-", "")}`;
  const bootstrapPool = new Pool({ connectionString: process.env.DATABASE_URL });
  const lockClient = await bootstrapPool.connect();
  let appPool: import("pg").Pool | undefined;
  let server: import("node:http").Server | undefined;

  t.after(async () => {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => error ? reject(error) : resolve());
      });
    }
    if (appPool) await appPool.end();
    lockClient.release();
    await bootstrapPool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await bootstrapPool.end();
  });

  await bootstrapPool.query(`CREATE SCHEMA "${schema}"`);
  await bootstrapPool.query(`
    CREATE TABLE "${schema}".admin_users (
      id serial PRIMARY KEY,
      email text NOT NULL UNIQUE,
      name text NOT NULL,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'viewer',
      is_active boolean NOT NULL DEFAULT true,
      mfa_secret_encrypted text,
      pending_mfa_secret_encrypted text,
      mfa_enabled boolean NOT NULL DEFAULT false,
      mfa_enrolled_at timestamptz,
      mfa_last_used_at timestamptz,
      session_version integer NOT NULL DEFAULT 0,
      last_login_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const databaseUrl = new URL(process.env.DATABASE_URL);
  databaseUrl.searchParams.set("options", `-c search_path=${schema}`);
  process.env.DATABASE_URL = databaseUrl.toString();

  const [{ db, pool, adminUsersTable }, { default: app }, auth, users] = await Promise.all([
    import("@workspace/db"),
    import("../../app"),
    import("./auth"),
    import("./users"),
  ]);
  appPool = pool;

  const fixtures = await db
    .insert(adminUsersTable)
    .values([
      { email: "owner-a@example.invalid", name: "Owner A", passwordHash: "unused", role: "owner" },
      { email: "owner-b@example.invalid", name: "Owner B", passwordHash: "unused", role: "owner" },
    ])
    .returning({
      id: adminUsersTable.id,
      email: adminUsersTable.email,
      sessionVersion: adminUsersTable.sessionVersion,
    });

  server = app.listen(0);
  await new Promise<void>((resolve, reject) => {
    server!.once("listening", resolve);
    server!.once("error", reject);
  });

  await lockClient.query("SELECT pg_advisory_lock($1)", [users.OWNER_MUTATION_LOCK_KEY]);
  const { port } = server.address() as AddressInfo;
  const requests = fixtures.map((fixture) => fetch(
    `http://127.0.0.1:${port}/api/admin/users/${fixture.id}`,
    {
      method: "DELETE",
      headers: {
        cookie: `admin_secure_session=${auth.createSecureAdminSessionValue(fixture.email, fixture.sessionVersion)}`,
        origin: "http://127.0.0.1:5000",
      },
    },
  ));

  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    const waiting = await bootstrapPool.query<{ count: string }>(
      `SELECT count(*)::text AS count
       FROM pg_locks
       WHERE locktype = 'advisory' AND granted = false AND objid = $1`,
      [users.OWNER_MUTATION_LOCK_KEY],
    );
    if (Number(waiting.rows[0]?.count) === 2) break;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  const waiting = await bootstrapPool.query<{ count: string }>(
    `SELECT count(*)::text AS count
     FROM pg_locks
     WHERE locktype = 'advisory' AND granted = false AND objid = $1`,
    [users.OWNER_MUTATION_LOCK_KEY],
  );
  assert.equal(Number(waiting.rows[0]?.count), 2, "both requests reached the owner mutation lock");

  await lockClient.query("SELECT pg_advisory_unlock($1)", [users.OWNER_MUTATION_LOCK_KEY]);
  const responses = await Promise.all(requests);
  assert.deepEqual(responses.map((response) => response.status).sort(), [204, 409]);
  const conflict = responses.find((response) => response.status === 409);
  assert.deepEqual(await conflict?.json(), { error: "The last active owner cannot be removed" });

  const remaining = await db
    .select({ id: adminUsersTable.id })
    .from(adminUsersTable)
    .where(and(
      eq(adminUsersTable.role, "owner"),
      eq(adminUsersTable.isActive, true),
    ));
  assert.equal(remaining.length, 1);
});
