import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const adminLoginAttemptsTable = pgTable("admin_login_attempts", {
  id: serial("id").primaryKey(),
  ip: text("ip").notNull().unique(),
  failedAttempts: integer("failed_attempts").notNull().default(0),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }).notNull().defaultNow(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
});

export type AdminLoginAttempt = typeof adminLoginAttemptsTable.$inferSelect;