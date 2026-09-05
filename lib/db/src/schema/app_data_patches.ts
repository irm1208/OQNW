import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const appDataPatchesTable = pgTable("app_data_patches", {
  id: text("id").primaryKey(),
  appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AppDataPatch = typeof appDataPatchesTable.$inferSelect;