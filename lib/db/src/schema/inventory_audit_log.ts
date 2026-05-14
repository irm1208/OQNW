import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const inventoryAuditLogTable = pgTable("inventory_audit_log", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  changeType: text("change_type").notNull(),
  quantityBefore: integer("quantity_before").notNull(),
  quantityAfter: integer("quantity_after").notNull(),
  quantityChange: integer("quantity_change").notNull(),
  reason: text("reason"),
  referenceId: text("reference_id"),
  referenceType: text("reference_type"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type InventoryAuditLog = typeof inventoryAuditLogTable.$inferSelect;
export type InsertInventoryAuditLog = typeof inventoryAuditLogTable.$inferInsert;
