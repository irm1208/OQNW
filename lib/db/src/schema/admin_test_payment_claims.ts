import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const adminTestPaymentClaimsTable = pgTable("admin_test_payment_claims", {
  sessionId: varchar("session_id", { length: 64 }).primaryKey(),
  paymentMethod: text("payment_method").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  claimedAt: timestamp("claimed_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AdminTestPaymentClaim = typeof adminTestPaymentClaimsTable.$inferSelect;
export type InsertAdminTestPaymentClaim = typeof adminTestPaymentClaimsTable.$inferInsert;