import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { adminUsersTable } from "./admin_users";

export const adminAuditEventsTable = pgTable("admin_audit_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  adminUserId: integer("admin_user_id").references(() => adminUsersTable.id, { onDelete: "set null" }),
  email: text("email"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  requestId: text("request_id"),
  success: boolean("success").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AdminAuditEvent = typeof adminAuditEventsTable.$inferSelect;