import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const adminUsersTable = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("viewer"),
  isActive: boolean("is_active").notNull().default(true),
  mfaSecretEncrypted: text("mfa_secret_encrypted"),
  pendingMfaSecretEncrypted: text("pending_mfa_secret_encrypted"),
  mfaEnabled: boolean("mfa_enabled").notNull().default(false),
  mfaEnrolledAt: timestamp("mfa_enrolled_at", { withTimezone: true }),
  mfaLastUsedAt: timestamp("mfa_last_used_at", { withTimezone: true }),
  sessionVersion: integer("session_version").notNull().default(0),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type AdminUser = typeof adminUsersTable.$inferSelect;
export type InsertAdminUser = typeof adminUsersTable.$inferInsert;

export const ADMIN_ROLES = ["owner", "manager", "viewer"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];
