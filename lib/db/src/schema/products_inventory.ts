import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsInventoryTable = pgTable("products_inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().unique(),
  productName: text("product_name").notNull(),
  productCategory: text("product_category").notNull(),
  productImage: text("product_image"),
  stockLevel: integer("stock_level").notNull().default(100),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(10),
  isPublished: boolean("is_published").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProductInventorySchema = createInsertSchema(productsInventoryTable).omit({
  id: true,
  updatedAt: true,
});

export type InsertProductInventory = z.infer<typeof insertProductInventorySchema>;
export type ProductInventory = typeof productsInventoryTable.$inferSelect;
