import { pgTable, serial, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const newsletterSubscribersTable = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  source: varchar("source", { length: 50 }).default("website").notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});
