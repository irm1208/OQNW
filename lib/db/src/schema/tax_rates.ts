import {
  pgTable,
  serial,
  text,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const taxRatesTable = pgTable("tax_rates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  countryCode: text("country_code").notNull(),
  countryName: text("country_name").notNull(),
  region: text("region"),
  rate: numeric("rate", { precision: 6, scale: 4 }).notNull(),
  isInclusive: boolean("is_inclusive").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type TaxRate = typeof taxRatesTable.$inferSelect;
export type InsertTaxRate = typeof taxRatesTable.$inferInsert;
