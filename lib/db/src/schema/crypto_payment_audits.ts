import {
  pgTable,
  serial,
  integer,
  text,
  numeric,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { ordersTable } from "./orders";

export const cryptoPaymentAuditsTable = pgTable("crypto_payment_audits", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  attemptId: integer("attempt_id"),
  txHash: text("tx_hash").notNull(),
  currency: text("currency").notNull(),
  network: text("network").notNull(),
  expectedWallet: text("expected_wallet").notNull(),
  expectedAmount: numeric("expected_amount", { precision: 30, scale: 18 }).notNull(),
  observedAmount: numeric("observed_amount", { precision: 30, scale: 18 }),
  confirmations: integer("confirmations"),
  result: text("result").notNull(),
  reason: text("reason"),
  evidence: jsonb("evidence").$type<Record<string, unknown> | null>(),
  checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CryptoPaymentAudit = typeof cryptoPaymentAuditsTable.$inferSelect;
export type InsertCryptoPaymentAudit = typeof cryptoPaymentAuditsTable.$inferInsert;