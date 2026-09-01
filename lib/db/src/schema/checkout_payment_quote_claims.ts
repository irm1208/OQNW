import { index, timestamp, varchar, pgTable } from "drizzle-orm/pg-core";

export const checkoutPaymentQuoteClaimsTable = pgTable(
  "checkout_payment_quote_claims",
  {
    tokenDigest: varchar("token_digest", { length: 64 }).primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    claimedAt: timestamp("claimed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    expiresAtIdx: index("checkout_payment_quote_claims_expires_at_idx").on(table.expiresAt),
  }),
);

export type CheckoutPaymentQuoteClaim =
  typeof checkoutPaymentQuoteClaimsTable.$inferSelect;