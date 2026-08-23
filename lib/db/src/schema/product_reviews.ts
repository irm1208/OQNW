import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const productReviewsTable = pgTable(
  "product_reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull(),
    customerId: integer("customer_id").notNull(),
    customerName: text("customer_name").notNull(),
    rating: integer("rating").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    isApproved: boolean("is_approved").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueReview: unique("product_reviews_customer_product_unique").on(
      table.productId,
      table.customerId,
    ),
  }),
);

export type ProductReview = typeof productReviewsTable.$inferSelect;
