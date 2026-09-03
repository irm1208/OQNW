import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { customersTable } from "./customers";
import { ordersTable } from "./orders";

export const affiliateProgramSettingsTable = pgTable("affiliate_program_settings", {
  id: integer("id").primaryKey().default(1),
  attributionWindowDays: integer("attribution_window_days").notNull().default(30),
  reviewHoldDays: integer("review_hold_days").notNull().default(30),
  customerDiscountPercent: numeric("customer_discount_percent", { precision: 5, scale: 2 }).notNull().default("10"),
  freeRewardThresholdGbp: numeric("free_reward_threshold_gbp", { precision: 10, scale: 2 }).notNull().default("1000"),
  freeRewardValueCapGbp: numeric("free_reward_value_cap_gbp", { precision: 10, scale: 2 }).notNull().default("50"),
  maxFreeRewardsPerPeriod: integer("max_free_rewards_per_period").notNull().default(1),
  payoutThresholdGbp: numeric("payout_threshold_gbp", { precision: 10, scale: 2 }).notNull().default("50"),
  tierWindowDays: integer("tier_window_days").notNull().default(90),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const affiliateTiersTable = pgTable("affiliate_tiers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  minimumSalesGbp: numeric("minimum_sales_gbp", { precision: 10, scale: 2 }).notNull().default("0"),
  commissionRatePercent: numeric("commission_rate_percent", { precision: 5, scale: 2 }).notNull(),
  rewardCreditGbp: numeric("reward_credit_gbp", { precision: 10, scale: 2 }).notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("affiliate_tiers_active_order_idx").on(table.isActive, table.sortOrder),
]);

export const affiliatePartnersTable = pgTable("affiliate_partners", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customersTable.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  trackingCode: text("tracking_code").notNull().unique(),
  discountCode: text("discount_code").notNull().unique(),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull().default("10"),
  status: text("status").notNull().default("pending"), // pending | approved | rejected | suspended
  channelUrl: text("channel_url"),
  audienceDescription: text("audience_description"),
  promotionPlan: text("promotion_plan"),
  notes: text("notes"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  suspendedAt: timestamp("suspended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("affiliate_partners_email_unique").on(table.email),
  index("affiliate_partners_status_created_idx").on(table.status, table.createdAt),
]);

export const affiliateOrderAttributionsTable = pgTable("affiliate_order_attributions", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => ordersTable.id, { onDelete: "restrict" }),
  partnerId: integer("partner_id").notNull().references(() => affiliatePartnersTable.id, { onDelete: "restrict" }),
  customerId: integer("customer_id").references(() => customersTable.id, { onDelete: "set null" }),
  trackingCodeSnapshot: text("tracking_code_snapshot").notNull(),
  discountCodeSnapshot: text("discount_code_snapshot"),
  source: text("source").notNull(), // tracking_link | discount_code
  clickedAt: timestamp("clicked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("affiliate_order_attributions_order_unique").on(table.orderId),
  index("affiliate_order_attributions_partner_created_idx").on(table.partnerId, table.createdAt),
]);

export const affiliateCommissionsTable = pgTable("affiliate_commissions", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull().references(() => affiliatePartnersTable.id, { onDelete: "restrict" }),
  orderId: integer("order_id").references(() => ordersTable.id, { onDelete: "restrict" }),
  eligibleSalesGbp: numeric("eligible_sales_gbp", { precision: 10, scale: 2 }).notNull(),
  commissionRatePercent: numeric("commission_rate_percent", { precision: 5, scale: 2 }).notNull(),
  amountGbp: numeric("amount_gbp", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending | approved | held | voided | paid
  statusReason: text("status_reason"),
  periodKey: text("period_key"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  heldAt: timestamp("held_at", { withTimezone: true }),
  voidedAt: timestamp("voided_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("affiliate_commissions_partner_order_unique").on(table.partnerId, table.orderId),
  index("affiliate_commissions_partner_status_idx").on(table.partnerId, table.status, table.createdAt),
  index("affiliate_commissions_status_created_idx").on(table.status, table.createdAt),
]);

export const affiliateRewardCreditsTable = pgTable("affiliate_reward_credits", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull().references(() => affiliatePartnersTable.id, { onDelete: "restrict" }),
  commissionId: integer("commission_id").references(() => affiliateCommissionsTable.id, { onDelete: "restrict" }),
  qualifyingSalesGbp: numeric("qualifying_sales_gbp", { precision: 10, scale: 2 }).notNull(),
  creditValueGbp: numeric("credit_value_gbp", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending | available | claimed | fulfilled | voided
  productSlug: text("product_slug"),
  claimedProductName: text("claimed_product_name"),
  statusReason: text("status_reason"),
  lastAdminActor: text("last_admin_actor"),
  availableAt: timestamp("available_at", { withTimezone: true }),
  claimedAt: timestamp("claimed_at", { withTimezone: true }),
  fulfilledAt: timestamp("fulfilled_at", { withTimezone: true }),
  voidedAt: timestamp("voided_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("affiliate_rewards_partner_status_idx").on(table.partnerId, table.status, table.createdAt),
  index("affiliate_rewards_commission_idx").on(table.commissionId),
  index("affiliate_rewards_status_created_idx").on(table.status, table.createdAt),
]);

export type AffiliateProgramSettings = typeof affiliateProgramSettingsTable.$inferSelect;
export type InsertAffiliateProgramSettings = typeof affiliateProgramSettingsTable.$inferInsert;
export type AffiliateTier = typeof affiliateTiersTable.$inferSelect;
export type InsertAffiliateTier = typeof affiliateTiersTable.$inferInsert;
export type AffiliatePartner = typeof affiliatePartnersTable.$inferSelect;
export type InsertAffiliatePartner = typeof affiliatePartnersTable.$inferInsert;
export type AffiliateCommission = typeof affiliateCommissionsTable.$inferSelect;
export type InsertAffiliateCommission = typeof affiliateCommissionsTable.$inferInsert;
export type AffiliateRewardCredit = typeof affiliateRewardCreditsTable.$inferSelect;
export type InsertAffiliateRewardCredit = typeof affiliateRewardCreditsTable.$inferInsert;