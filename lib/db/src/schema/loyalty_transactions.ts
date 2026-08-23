import { pgTable, serial, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const loyaltyTransactionsTable = pgTable("loyalty_transactions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  orderId: integer("order_id"),
  type: varchar("type", { length: 20 }).notNull(),
  points: integer("points").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
