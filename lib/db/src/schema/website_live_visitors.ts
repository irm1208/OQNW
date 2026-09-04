import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";

export const websiteLiveVisitorsTable = pgTable("website_live_visitors", {
  visitorId: text("visitor_id").primaryKey(),
  path: text("path").notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("website_live_visitors_last_seen_at_idx").on(table.lastSeenAt),
]);

export type WebsiteLiveVisitor = typeof websiteLiveVisitorsTable.$inferSelect;