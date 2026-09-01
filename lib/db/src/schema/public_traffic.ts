import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const publicTrafficLimitsTable = pgTable("public_traffic_limits", {
  clientKey: text("client_key").primaryKey(),
  ip: text("ip").notNull(),
  resourceKind: text("resource_kind").notNull(),
  windowStartedAt: timestamp("window_started_at", { withTimezone: true }).notNull().defaultNow(),
  requestCount: integer("request_count").notNull().default(0),
  behaviorStartedAt: timestamp("behavior_started_at", { withTimezone: true }).notNull().defaultNow(),
  recentPaths: text("recent_paths").array().notNull().default(sql`ARRAY[]::text[]`),
  lastPath: text("last_path").notNull(),
  lastUserAgent: text("last_user_agent"),
  blockedUntil: timestamp("blocked_until", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const publicTrafficEventsTable = pgTable(
  "public_traffic_events",
  {
    id: serial("id").primaryKey(),
    clientKey: text("client_key").notNull(),
    ip: text("ip").notNull(),
    resourceKind: text("resource_kind").notNull(),
    path: text("path").notNull(),
    userAgent: text("user_agent"),
    requestCount: integer("request_count").notNull(),
    uniquePathCount: integer("unique_path_count").notNull(),
    action: text("action").notNull(),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("public_traffic_events_created_at_idx").on(table.createdAt),
    ipIdx: index("public_traffic_events_ip_idx").on(table.ip),
  }),
);

export type PublicTrafficLimit = typeof publicTrafficLimitsTable.$inferSelect;
export type PublicTrafficEvent = typeof publicTrafficEventsTable.$inferSelect;