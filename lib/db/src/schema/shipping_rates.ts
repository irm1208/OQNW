import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { shippingZonesTable } from "./shipping_zones";

export const shippingRatesTable = pgTable("shipping_rates", {
  id: serial("id").primaryKey(),
  zoneId: integer("zone_id")
    .notNull()
    .references(() => shippingZonesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  carrier: text("carrier").notNull().default("Royal Mail"),
  priceGbp: numeric("price_gbp", { precision: 10, scale: 2 }).notNull().default("0"),
  freeAboveGbp: numeric("free_above_gbp", { precision: 10, scale: 2 }),
  estimatedDaysMin: integer("estimated_days_min").notNull().default(2),
  estimatedDaysMax: integer("estimated_days_max").notNull().default(5),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type ShippingRate = typeof shippingRatesTable.$inferSelect;
export type InsertShippingRate = typeof shippingRatesTable.$inferInsert;
