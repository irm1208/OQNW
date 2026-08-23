import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const storeSettingsTable = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").notNull().default("OmniQure"),
  supportEmail: text("support_email"),
  supportPhone: text("support_phone"),
  currency: text("currency").notNull().default("GBP"),
  orderPrefix: text("order_prefix").notNull().default("OQ"),
  addressLine1: text("address_line1"),
  addressLine2: text("address_line2"),
  city: text("city"),
  postcode: text("postcode"),
  country: text("country"),
  announcementBanner: text("announcement_banner"),
  maintenanceMode: boolean("maintenance_mode").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type StoreSettings = typeof storeSettingsTable.$inferSelect;
export type InsertStoreSettings = typeof storeSettingsTable.$inferInsert;
