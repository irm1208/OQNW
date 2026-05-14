import {
  pgTable,
  serial,
  text,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const giftCardsTable = pgTable("gift_cards", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  amountGbp: numeric("amount_gbp", { precision: 10, scale: 2 }).notNull(),
  remainingGbp: numeric("remaining_gbp", { precision: 10, scale: 2 }).notNull(),
  purchaserEmail: text("purchaser_email").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  recipientName: text("recipient_name"),
  message: text("message"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }),
});

export type GiftCard = typeof giftCardsTable.$inferSelect;
