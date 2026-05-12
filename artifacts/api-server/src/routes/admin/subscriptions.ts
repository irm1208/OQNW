import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { subscriptionsTable, customersTable } from "@workspace/db";
import { eq, desc, count, and, ne } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (!req.session?.adminAuthenticated) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

router.get("/admin/subscriptions", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  try {
    const subs = await db
      .select({
        id: subscriptionsTable.id,
        customerId: subscriptionsTable.customerId,
        itemsJson: subscriptionsTable.itemsJson,
        intervalDays: subscriptionsTable.intervalDays,
        nextRenewalAt: subscriptionsTable.nextRenewalAt,
        discountPct: subscriptionsTable.discountPct,
        status: subscriptionsTable.status,
        pausedAt: subscriptionsTable.pausedAt,
        createdAt: subscriptionsTable.createdAt,
        customerEmail: customersTable.email,
        customerFirstName: customersTable.firstName,
        customerLastName: customersTable.lastName,
      })
      .from(subscriptionsTable)
      .leftJoin(customersTable, eq(subscriptionsTable.customerId, customersTable.id))
      .orderBy(desc(subscriptionsTable.createdAt));

    const rows = subs.map((s) => {
      let items: { productId: number; productName: string; quantity: number; priceGbp: number }[] = [];
      try { items = JSON.parse(s.itemsJson); } catch {}
      const subtotal = items.reduce((acc, i) => acc + i.priceGbp * i.quantity, 0);
      const discountedTotal = subtotal * (1 - s.discountPct / 100);
      return {
        id: s.id,
        customerId: s.customerId,
        customerName: s.customerFirstName && s.customerLastName
          ? `${s.customerFirstName} ${s.customerLastName}`
          : "Unknown",
        customerEmail: s.customerEmail ?? "",
        items,
        intervalDays: s.intervalDays,
        nextRenewalAt: s.nextRenewalAt.toISOString(),
        discountPct: s.discountPct,
        status: s.status,
        subtotal: parseFloat(subtotal.toFixed(2)),
        discountedTotal: parseFloat(discountedTotal.toFixed(2)),
        createdAt: s.createdAt.toISOString(),
      };
    });

    const all = rows;
    const active = all.filter((s) => s.status === "active");
    const paused = all.filter((s) => s.status === "paused");
    const totalMrr = active.reduce((sum, s) => {
      const monthly = (30 / s.intervalDays) * s.discountedTotal;
      return sum + monthly;
    }, 0);

    res.json({
      subscriptions: rows,
      stats: {
        total: all.filter((s) => s.status !== "cancelled").length,
        active: active.length,
        paused: paused.length,
        mrr: parseFloat(totalMrr.toFixed(2)),
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list admin subscriptions");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
