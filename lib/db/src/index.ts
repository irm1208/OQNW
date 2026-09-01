import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

function databaseConnectionString(value: string): string {
  const url = new URL(value);
  const isPostgres = url.protocol === "postgres:" || url.protocol === "postgresql:";
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const hasExplicitSslMode = url.searchParams.has("sslmode");
  if (isPostgres && !isLocal && !hasExplicitSslMode) {
    url.searchParams.set("sslmode", "verify-full");
  }
  return url.toString();
}

export const pool = new Pool({ connectionString: databaseConnectionString(process.env.DATABASE_URL) });
export const db = drizzle(pool, { schema });

export * from "./schema";
