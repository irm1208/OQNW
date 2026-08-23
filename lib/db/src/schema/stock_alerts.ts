import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const stockAlertsTable = pgTable("stock_alerts", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  notifiedAt: timestamp("notified_at", { withTimezone: true }),
});

export type StockAlert = typeof stockAlertsTable.$inferSelect;
