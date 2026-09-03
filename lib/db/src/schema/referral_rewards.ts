import { boolean, index, integer, numeric, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { customersTable } from "./customers";
import { ordersTable } from "./orders";

/**
 * Individual referral value is deliberately recorded separately from the
 * customers.referralCreditGbp compatibility balance.  That balance is what
 * checkout exposes; this table is the auditable source for all new value.
 */
export const referralRewardsTable = pgTable("referral_rewards", {
  id: serial("id").primaryKey(),
  beneficiaryCustomerId: integer("beneficiary_customer_id").references(() => customersTable.id, { onDelete: "restrict" }),
  referrerCustomerId: integer("referrer_customer_id").references(() => customersTable.id, { onDelete: "restrict" }),
  referredCustomerId: integer("referred_customer_id").references(() => customersTable.id, { onDelete: "restrict" }),
  qualifyingOrderId: integer("qualifying_order_id").references(() => ordersTable.id, { onDelete: "restrict" }),
  beneficiaryRole: text("beneficiary_role").notNull(), // referrer | referred | historical
  status: text("status").notNull().default("pending"), // pending | earned | redeemed | held | voided | legacy
  amountGbp: numeric("amount_gbp", { precision: 10, scale: 2 }).notNull(),
  remainingAmountGbp: numeric("remaining_amount_gbp", { precision: 10, scale: 2 }).notNull(),
  statusReason: text("status_reason"),
  historical: boolean("historical").notNull().default(false),
  lastAdminActor: text("last_admin_actor"),
  earnedAt: timestamp("earned_at", { withTimezone: true }),
  heldAt: timestamp("held_at", { withTimezone: true }),
  voidedAt: timestamp("voided_at", { withTimezone: true }),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("referral_rewards_issuance_unique").on(table.qualifyingOrderId, table.beneficiaryCustomerId, table.beneficiaryRole),
  index("referral_rewards_beneficiary_status_idx").on(table.beneficiaryCustomerId, table.status, table.createdAt),
  index("referral_rewards_referred_customer_idx").on(table.referredCustomerId),
]);

export const referralRedemptionAllocationsTable = pgTable("referral_redemption_allocations", {
  id: serial("id").primaryKey(),
  rewardId: integer("reward_id").notNull().references(() => referralRewardsTable.id, { onDelete: "restrict" }),
  orderId: integer("order_id").notNull().references(() => ordersTable.id, { onDelete: "restrict" }),
  customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "restrict" }),
  amountGbp: numeric("amount_gbp", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("referral_redemption_reward_order_unique").on(table.rewardId, table.orderId),
  index("referral_redemption_order_idx").on(table.orderId),
]);

export type ReferralReward = typeof referralRewardsTable.$inferSelect;