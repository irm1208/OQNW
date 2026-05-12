import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const emailLogsTable = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  toEmail: text("to_email").notNull(),
  subject: text("subject").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("sent"),
  resendId: text("resend_id"),
  orderNumber: text("order_number"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EmailLog = typeof emailLogsTable.$inferSelect;
