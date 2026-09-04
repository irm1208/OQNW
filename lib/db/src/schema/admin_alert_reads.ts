import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { adminUsersTable } from "./admin_users";

export const adminAlertReadsTable = pgTable("admin_alert_reads", {
  id: serial("id").primaryKey(),
  adminUserId: integer("admin_user_id").notNull().references(() => adminUsersTable.id, { onDelete: "cascade" }),
  alertId: text("alert_id").notNull(),
  alertCreatedAt: timestamp("alert_created_at", { withTimezone: true }).notNull(),
  readAt: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("admin_alert_reads_user_alert_event_idx").on(
    table.adminUserId,
    table.alertId,
    table.alertCreatedAt,
  ),
  index("admin_alert_reads_cleanup_idx").on(table.readAt, table.id),
]);

export type AdminAlertRead = typeof adminAlertReadsTable.$inferSelect;