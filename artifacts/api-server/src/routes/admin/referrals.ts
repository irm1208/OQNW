import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { customersTable, ordersTable } from "@workspace/db";
import { asc, desc, inArray, isNotNull } from "drizzle-orm";

const router = Router();

const REFERRAL_REWARD_GBP = 25;
const VALID_STATUSES = new Set(["all", "pending", "qualified", "flagged"]);

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function asMoney(value: unknown): number {
  return Number.parseFloat(String(value ?? 0)) || 0;
}

router.get("/admin/referrals", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const requestedStatus = typeof req.query.status === "string" ? req.query.status : "all";
  const status = VALID_STATUSES.has(requestedStatus) ? requestedStatus : "all";
  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";

  try {
    const referredCustomers = await db
      .select({
        id: customersTable.id,
        email: customersTable.email,
        firstName: customersTable.firstName,
        lastName: customersTable.lastName,
        referredBy: customersTable.referredBy,
        referralCreditGbp: customersTable.referralCreditGbp,
        referralAbuseFlag: customersTable.referralAbuseFlag,
        totalOrders: customersTable.totalOrders,
        totalSpendGbp: customersTable.totalSpendGbp,
        createdAt: customersTable.createdAt,
      })
      .from(customersTable)
      .where(isNotNull(customersTable.referredBy))
      .orderBy(desc(customersTable.createdAt));

    const referredIds = referredCustomers.map((customer) => customer.id);
    const referralCodes = [
      ...new Set(
        referredCustomers
          .map((customer) => customer.referredBy)
          .filter((code): code is string => Boolean(code)),
      ),
    ];

    const referrers =
      referralCodes.length > 0
        ? await db
            .select({
              id: customersTable.id,
              email: customersTable.email,
              firstName: customersTable.firstName,
              lastName: customersTable.lastName,
              referralCode: customersTable.referralCode,
              referralCreditGbp: customersTable.referralCreditGbp,
            })
            .from(customersTable)
            .where(inArray(customersTable.referralCode, referralCodes))
        : [];
    const firstOrders =
      referredIds.length > 0
        ? await db
            .select({
              customerId: ordersTable.customerId,
              orderNumber: ordersTable.orderNumber,
              status: ordersTable.status,
              createdAt: ordersTable.createdAt,
            })
            .from(ordersTable)
            .where(inArray(ordersTable.customerId, referredIds))
            .orderBy(asc(ordersTable.createdAt))
        : [];
    const allCustomerBalances = await db
      .select({ referralCreditGbp: customersTable.referralCreditGbp })
      .from(customersTable);

    const referrerByCode = new Map(
      referrers
        .filter((referrer) => Boolean(referrer.referralCode))
        .map((referrer) => [referrer.referralCode!, referrer]),
    );
    const firstOrderByCustomerId = new Map<number, (typeof firstOrders)[number]>();
    for (const order of firstOrders) {
      if (order.customerId !== null && !firstOrderByCustomerId.has(order.customerId)) {
        firstOrderByCustomerId.set(order.customerId, order);
      }
    }

    const referrals = referredCustomers
      .map((customer) => {
        const referrer = customer.referredBy ? referrerByCode.get(customer.referredBy) : undefined;
        const firstOrder = firstOrderByCustomerId.get(customer.id);
        const rowStatus = customer.referralAbuseFlag
          ? "flagged"
          : customer.totalOrders > 0
            ? "qualified"
            : "pending";

        return {
          id: customer.id,
          status: rowStatus,
          referredCustomer: {
            id: customer.id,
            name: `${customer.firstName} ${customer.lastName}`.trim(),
            email: customer.email,
            joinedAt: customer.createdAt.toISOString(),
            totalOrders: customer.totalOrders,
            totalSpendGbp: asMoney(customer.totalSpendGbp),
            referralCreditGbp: asMoney(customer.referralCreditGbp),
          },
          referrer: referrer
            ? {
                id: referrer.id,
                name: `${referrer.firstName} ${referrer.lastName}`.trim(),
                email: referrer.email,
                referralCode: referrer.referralCode,
                referralCreditGbp: asMoney(referrer.referralCreditGbp),
              }
            : null,
          firstOrder: firstOrder
            ? {
                orderNumber: firstOrder.orderNumber,
                status: firstOrder.status,
                createdAt: firstOrder.createdAt.toISOString(),
              }
            : null,
          rewardGbp: rowStatus === "qualified" ? REFERRAL_REWARD_GBP : 0,
        };
      })
      .filter((referral) => {
        if (status !== "all" && referral.status !== status) return false;
        if (!search) return true;
        return [
          referral.referredCustomer.name,
          referral.referredCustomer.email,
          referral.referrer?.name,
          referral.referrer?.email,
          referral.referrer?.referralCode,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));
      });

    const allStatuses = referredCustomers.map((customer) =>
      customer.referralAbuseFlag
        ? "flagged"
        : customer.totalOrders > 0
          ? "qualified"
          : "pending",
    );

    res.json({
      stats: {
        total: allStatuses.length,
        pending: allStatuses.filter((item) => item === "pending").length,
        qualified: allStatuses.filter((item) => item === "qualified").length,
        flagged: allStatuses.filter((item) => item === "flagged").length,
        conversionRate:
          allStatuses.length > 0
            ? Number(
                (
                  (allStatuses.filter((item) => item === "qualified").length / allStatuses.length) *
                  100
                ).toFixed(1),
              )
            : 0,
        outstandingCreditGbp: allCustomerBalances.reduce(
          (total, customer) => total + asMoney(customer.referralCreditGbp),
          0,
        ),
      },
      referrals,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list referrals");
    res.status(500).json({ error: "Failed to list referrals" });
  }
});

export default router;