import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  itemsJson: text("items_json").notNull(),
  intervalDays: integer("interval_days").notNull().default(30),
  nextRenewalAt: timestamp("next_renewal_at", { withTimezone: true }).notNull(),
  discountPct: integer("discount_pct").notNull().default(5),
  status: text("status").notNull().default("active"),
  pausedAt: timestamp("paused_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Subscription = typeof subscriptionsTable.$inferSelect;
