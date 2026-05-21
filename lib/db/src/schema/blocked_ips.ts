import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const blockedIpsTable = pgTable("blocked_ips", {
  id: serial("id").primaryKey(),
  ip: text("ip").notNull().unique(),
  reason: text("reason"),
  blockedAt: timestamp("blocked_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BlockedIp = typeof blockedIpsTable.$inferSelect;
