import {
  pgTable,
  serial,
  integer,
  text,
  numeric,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { ordersTable } from "./orders";

export const cryptoPaymentAttemptsTable = pgTable(
  "crypto_payment_attempts",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => ordersTable.id, { onDelete: "cascade" }),
    txHash: text("tx_hash").notNull(),
    currency: text("currency").notNull(),
    network: text("network").notNull(),
    walletAddress: text("wallet_address").notNull(),
    expectedAmount: numeric("expected_amount", { precision: 30, scale: 18 }).notNull(),
    observedAmount: numeric("observed_amount", { precision: 30, scale: 18 }),
    confirmations: integer("confirmations"),
    status: text("status").notNull().default("pending"),
    reason: text("reason"),
    evidence: jsonb("evidence").$type<Record<string, unknown> | null>(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
    lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  },
  (table) => ({
    txHashUnique: uniqueIndex("crypto_payment_attempts_tx_hash_unique").on(table.txHash),
  }),
);

export type CryptoPaymentAttempt = typeof cryptoPaymentAttemptsTable.$inferSelect;
export type InsertCryptoPaymentAttempt = typeof cryptoPaymentAttemptsTable.$inferInsert;