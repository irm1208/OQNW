import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const returnsTable = pgTable("returns", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  orderNumber: text("order_number").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("requested"),
  refundAmountGbp: numeric("refund_amount_gbp", { precision: 10, scale: 2 }),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Return = typeof returnsTable.$inferSelect;
