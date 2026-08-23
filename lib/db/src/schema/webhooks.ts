import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const webhooksTable = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  events: text("events").array().notNull().default([]),
  secret: text("secret").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const webhookDeliveriesTable = pgTable("webhook_deliveries", {
  id: serial("id").primaryKey(),
  webhookId: integer("webhook_id")
    .notNull()
    .references(() => webhooksTable.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  payloadJson: text("payload_json").notNull(),
  status: text("status").notNull().default("pending"),
  responseCode: integer("response_code"),
  responseBody: text("response_body"),
  attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Webhook = typeof webhooksTable.$inferSelect;
export type WebhookDelivery = typeof webhookDeliveriesTable.$inferSelect;
