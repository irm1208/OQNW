import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsCatalogTable = pgTable("products_catalog", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  priceGbp: numeric("price_gbp", { precision: 10, scale: 2 }),
  shortDescription: text("short_description"),
  description: text("description"),
  imageUrl: text("image_url"),
  purity: text("purity"),
  alsoKnownAs: text("also_known_as"),
  molecularWeight: text("molecular_weight"),
  casNumber: text("cas_number"),
  formula: text("formula"),
  sequence: text("sequence"),
  storage: text("storage"),
  appearance: text("appearance"),
  solubility: text("solubility"),
  halfLife: text("half_life"),
  coaUrl: text("coa_url"),
  msImageUrl: text("ms_image_url"),
  isPublished: boolean("is_published").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProductCatalogSchema = createInsertSchema(productsCatalogTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProductCatalog = z.infer<typeof insertProductCatalogSchema>;
export type ProductCatalog = typeof productsCatalogTable.$inferSelect;
