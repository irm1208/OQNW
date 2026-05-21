import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const customerCreditsTable = pgTable("customer_credits", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().unique(),
  balancePence: integer("balance_pence").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type CustomerCredit = typeof customerCreditsTable.$inferSelect;

export const customerCreditTransactionsTable = pgTable("customer_credit_transactions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  amountPence: integer("amount_pence").notNull(),
  type: text("type").notNull(),
  reason: text("reason").notNull(),
  adminNote: text("admin_note"),
  orderId: integer("order_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CustomerCreditTransaction = typeof customerCreditTransactionsTable.$inferSelect;
