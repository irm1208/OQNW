import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { adminUsersTable } from "./admin_users";

export const adminRecoveryCodesTable = pgTable("admin_recovery_codes", {
  id: serial("id").primaryKey(),
  adminUserId: integer("admin_user_id").notNull().references(() => adminUsersTable.id, { onDelete: "cascade" }),
  codeHash: text("code_hash").notNull().unique(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AdminRecoveryCode = typeof adminRecoveryCodesTable.$inferSelect;