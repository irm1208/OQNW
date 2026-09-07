import { sql, type SQL } from "drizzle-orm";
import type { CustomerSegmentRules } from "@workspace/db";

type ParseResult<T> = { success: true; data: T } | { success: false };
type Schema<T> = { safeParse(value: unknown): ParseResult<T> };
type SegmentInput = { name: string; description?: string | null; rules: CustomerSegmentRules; isActive?: boolean };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rules(value: unknown): CustomerSegmentRules | null {
  if (!isRecord(value) || Object.keys(value).some(key => key !== "matchMode" && key !== "conditions") ||
    value.matchMode !== "all" || !Array.isArray(value.conditions) || value.conditions.length < 1 || value.conditions.length > 20) return null;
  for (const condition of value.conditions) {
    if (!isRecord(condition) || Object.keys(condition).some(key => !["field", "operator", "value"].includes(key))) return null;
    const field = condition.field;
    if (["total_orders", "total_spend_gbp", "days_since_last_order", "account_age_days"].includes(String(field))) {
      if (!["gte", "lte"].includes(String(condition.operator)) || typeof condition.value !== "number" ||
        !Number.isFinite(condition.value) || condition.value < 0 || condition.value > 1_000_000_000) return null;
    } else if (field === "marketing_status") {
      if (condition.operator !== "equals" || !["subscribed", "unsubscribed"].includes(String(condition.value))) return null;
    } else if (["has_abandoned_cart", "has_wholesale_order", "is_referred", "is_affiliate"].includes(String(field))) {
      if (condition.operator !== "equals" || typeof condition.value !== "boolean") return null;
    } else return null;
  }
  return value as CustomerSegmentRules;
}

function segmentFields(value: unknown, partial: boolean): SegmentInput | null {
  if (!isRecord(value) || Object.keys(value).some(key => !["name", "description", "rules", "isActive"].includes(key))) return null;
  if (partial && Object.keys(value).length === 0) return null;
  if (!partial && (!("name" in value) || !("rules" in value))) return null;
  const result: SegmentInput = {} as SegmentInput;
  if ("name" in value) {
    if (typeof value.name !== "string" || !(result.name = value.name.trim()) || result.name.length > 120) return null;
  }
  if ("description" in value) {
    if (value.description !== null && (typeof value.description !== "string" || value.description.trim().length > 2_000)) return null;
    result.description = typeof value.description === "string" ? value.description.trim() : null;
  }
  if ("rules" in value) {
    const parsedRules = rules(value.rules);
    if (!parsedRules) return null;
    result.rules = parsedRules;
  }
  if ("isActive" in value) {
    if (typeof value.isActive !== "boolean") return null;
    result.isActive = value.isActive;
  }
  return result;
}

export const customerSegmentRulesSchema: Schema<CustomerSegmentRules> = { safeParse: value => {
  const data = rules(value); return data ? { success: true, data } : { success: false };
} };
export const createCustomerSegmentSchema: Schema<SegmentInput> = { safeParse: value => {
  const data = segmentFields(value, false); return data ? { success: true, data } : { success: false };
} };
export const patchCustomerSegmentSchema: Schema<Partial<SegmentInput>> = { safeParse: value => {
  const data = segmentFields(value, true); return data ? { success: true, data } : { success: false };
} };

export function customerSegmentWhere(rules: CustomerSegmentRules): SQL {
  const conditions = rules.conditions.map((condition) => {
    if (condition.field === "total_orders") {
      return condition.operator === "gte"
        ? sql`order_count >= ${condition.value}`
        : sql`order_count <= ${condition.value}`;
    }
    if (condition.field === "total_spend_gbp") {
      return condition.operator === "gte"
        ? sql`total_spend_gbp >= ${condition.value}`
        : sql`total_spend_gbp <= ${condition.value}`;
    }
    if (condition.field === "days_since_last_order") {
      // A customer with no qualifying orders has no last-order age to match.
      const expression = sql`last_order_at IS NOT NULL AND extract(day from now() - last_order_at)`;
      return condition.operator === "gte"
        ? sql`${expression} >= ${condition.value}`
        : sql`${expression} <= ${condition.value}`;
    }
    if (condition.field === "account_age_days") {
      return condition.operator === "gte"
        ? sql`extract(day from now() - customer_created_at) >= ${condition.value}`
        : sql`extract(day from now() - customer_created_at) <= ${condition.value}`;
    }
    if (condition.field === "marketing_status") {
      return sql`marketing_status = ${condition.value}`;
    }
    const column = {
      has_abandoned_cart: sql`has_abandoned_cart`,
      has_wholesale_order: sql`has_wholesale_order`,
      is_referred: sql`is_referred`,
      is_affiliate: sql`is_affiliate`,
    }[condition.field];
    return sql`${column} = ${condition.value}`;
  });
  return sql.join(conditions, sql` AND `);
}

export function customerSegmentMembersQuery(rules: CustomerSegmentRules, limit?: number, offset?: number): SQL {
  const where = customerSegmentWhere(rules);
  const paging = limit === undefined ? sql`` : sql` LIMIT ${limit} OFFSET ${offset ?? 0}`;
  return sql`
    WITH member_data AS (
      SELECT c.id, c.first_name, c.last_name, c.email, c.created_at AS customer_created_at,
        count(o.id)::int AS order_count,
        coalesce(sum(o.total_gbp), 0) AS total_spend_gbp,
        max(o.created_at) AS last_order_at,
        CASE WHEN EXISTS (
          SELECT 1 FROM newsletter_subscribers ns
          WHERE lower(ns.email) = lower(c.email) AND ns.is_active = true AND ns.unsubscribed_at IS NULL
        ) THEN 'subscribed' ELSE 'unsubscribed' END AS marketing_status,
        EXISTS (SELECT 1 FROM abandoned_carts ac WHERE ac.customer_id = c.id AND ac.converted_at IS NULL AND ac.archived_at IS NULL) AS has_abandoned_cart,
        EXISTS (SELECT 1 FROM wholesale_invoices wi JOIN orders wo ON wo.id = wi.order_id WHERE wo.customer_id = c.id) AS has_wholesale_order,
        (c.referred_by IS NOT NULL AND c.referred_by <> '') AS is_referred,
        EXISTS (SELECT 1 FROM affiliate_partners ap WHERE ap.customer_id = c.id) AS is_affiliate
      FROM customers c
      LEFT JOIN orders o ON o.customer_id = c.id AND lower(o.status) NOT IN ('cancelled', 'failed')
      GROUP BY c.id
    )
    SELECT * FROM member_data WHERE ${where} ORDER BY customer_created_at DESC, id DESC${paging}`;
}

export function customerSegmentCountQuery(rules: CustomerSegmentRules): SQL {
  return sql`SELECT count(*)::int AS total FROM (${customerSegmentMembersQuery(rules)}) matching_members`;
}