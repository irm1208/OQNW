import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const databaseBackupRunsTable = pgTable("database_backup_runs", {
  id: serial("id").primaryKey(),
  status: text("status").notNull(),
  ownerToken: text("owner_token"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  heartbeatAt: timestamp("heartbeat_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  driveFileId: text("drive_file_id"),
  driveFileName: text("drive_file_name"),
  error: text("error"),
}, (table) => [
  index("database_backup_runs_status_completed_idx").on(table.status, table.completedAt),
]);

export type DatabaseBackupRun = typeof databaseBackupRunsTable.$inferSelect;