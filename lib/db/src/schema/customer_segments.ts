import { boolean, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type CustomerSegmentRules = {
  matchMode: "all";
  conditions: Array<{
    field: "total_orders" | "total_spend_gbp" | "days_since_last_order" | "account_age_days";
    operator: "gte" | "lte";
    value: number;
  } | {
    field: "marketing_status";
    operator: "equals";
    value: "subscribed" | "unsubscribed";
  } | {
    field: "has_abandoned_cart" | "has_wholesale_order" | "is_referred" | "is_affiliate";
    operator: "equals";
    value: boolean;
  }>;
};

export const customerSegmentsTable = pgTable("customer_segments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  rules: jsonb("rules").$type<CustomerSegmentRules>().notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type CustomerSegment = typeof customerSegmentsTable.$inferSelect;