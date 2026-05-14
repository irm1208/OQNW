import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { ordersTable } from "./orders";

export const refundsLogTable = pgTable("refunds_log", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  orderNumber: text("order_number").notNull(),
  amountGbp: numeric("amount_gbp", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull().default("partial"),
  reason: text("reason").notNull(),
  notes: text("notes"),
  restoreInventory: boolean("restore_inventory").notNull().default(false),
  lineItemsJson: text("line_items_json"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type RefundLog = typeof refundsLogTable.$inferSelect;
export type InsertRefundLog = typeof refundsLogTable.$inferInsert;
