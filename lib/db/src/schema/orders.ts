import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerId: integer("customer_id"),
  phone: text("phone"),
  address1: text("address1"),
  address2: text("address2"),
  city: text("city"),
  county: text("county"),
  postcode: text("postcode"),
  country: text("country"),
  subtotalGbp: numeric("subtotal_gbp", { precision: 10, scale: 2 }).notNull().default("0"),
  shippingCostGbp: numeric("shipping_cost_gbp", { precision: 10, scale: 2 }).notNull().default("0"),
  totalGbp: numeric("total_gbp", { precision: 10, scale: 2 }).notNull().default("0"),
  shippingMethod: text("shipping_method"),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  reviewRequestSentAt: timestamp("review_request_sent_at", { withTimezone: true }),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
