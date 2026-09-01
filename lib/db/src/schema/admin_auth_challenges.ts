import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { adminUsersTable } from "./admin_users";

export const adminAuthChallengesTable = pgTable("admin_auth_challenges", {
  id: serial("id").primaryKey(),
  adminUserId: integer("admin_user_id").notNull().references(() => adminUsersTable.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AdminAuthChallenge = typeof adminAuthChallengesTable.$inferSelect;