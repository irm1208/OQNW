import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { stockAlertsTable } from "@workspace/db";
import { and, eq, isNull, isNotNull, sql } from "drizzle-orm";
import { sendBackInStockEmail } from "../lib/email";

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

const router = Router();

router.post("/products/:productId/stock-alert", async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(req.params.productId as string, 10);
  if (isNaN(productId)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  const { email, name, productName } = req.body as {
    email?: unknown;
    name?: unknown;
    productName?: unknown;
  };

  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email address is required" });
    return;
  }

  try {
    await db
      .insert(stockAlertsTable)
      .values({
        productId,
        productName: typeof productName === "string" ? productName : "Product",
        customerEmail: email.toLowerCase().trim(),
        customerName: typeof name === "string" ? name.trim() || null : null,
        notifiedAt: null,
      })
      .onConflictDoNothing();

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to save stock alert");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/products/:productId/stock-alert", async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(req.params.productId as string, 10);
  const email = typeof req.query.email === "string" ? req.query.email.toLowerCase().trim() : null;
  if (isNaN(productId) || !email) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  try {
    await db
      .delete(stockAlertsTable)
      .where(and(eq(stockAlertsTable.productId, productId), eq(stockAlertsTable.customerEmail, email)));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /admin/stock-alerts — list all requests grouped by product
router.get("/admin/stock-alerts", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const all = await db.select().from(stockAlertsTable);

    const byProduct: Record<number, {
      productId: number;
      productName: string;
      pendingCount: number;
      totalCount: number;
      lastSignupAt: string | null;
    }> = {};

    for (const row of all) {
      if (!byProduct[row.productId]) {
        byProduct[row.productId] = {
          productId: row.productId,
          productName: row.productName ?? "Unknown",
          pendingCount: 0,
          totalCount: 0,
          lastSignupAt: null,
        };
      }
      byProduct[row.productId].totalCount++;
      if (!row.notifiedAt) byProduct[row.productId].pendingCount++;
      const rowDate = row.createdAt?.toISOString() ?? null;
      if (rowDate && (!byProduct[row.productId].lastSignupAt || rowDate > byProduct[row.productId].lastSignupAt!)) {
        byProduct[row.productId].lastSignupAt = rowDate;
      }
    }

    const totalPending = all.filter(r => !r.notifiedAt).length;
    const totalNotified = all.filter(r => !!r.notifiedAt).length;

    res.json({
      stats: { totalPending, totalNotified, productsWithWaitlist: Object.values(byProduct).filter(p => p.pendingCount > 0).length },
      products: Object.values(byProduct).sort((a, b) => b.pendingCount - a.pendingCount),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stock alerts");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /admin/stock-alerts/notify/:productId — manually fire emails for a product
router.post("/admin/stock-alerts/notify/:productId", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const productId = parseInt(req.params.productId as string, 10);
  if (isNaN(productId)) { res.status(400).json({ error: "Invalid product ID" }); return; }
  try {
    const pending = await db
      .select()
      .from(stockAlertsTable)
      .where(and(eq(stockAlertsTable.productId, productId), isNull(stockAlertsTable.notifiedAt)));

    if (pending.length === 0) { res.json({ sent: 0 }); return; }

    const productName = pending[0].productName ?? "Product";
    let sent = 0;
    for (const alert of pending) {
      await sendBackInStockEmail({
        customerEmail: alert.customerEmail,
        customerName: alert.customerName ?? "Researcher",
        productName,
      });
      await db.update(stockAlertsTable).set({ notifiedAt: new Date() }).where(eq(stockAlertsTable.id, alert.id));
      sent++;
    }

    req.log.info({ productId, sent }, "Manual back-in-stock notification sent");
    res.json({ sent });
  } catch (err) {
    req.log.error({ err }, "Failed to send stock alerts");
    res.status(500).json({ error: "Internal server error" });
  }
});

export async function notifyStockAlerts(productId: number, productName: string): Promise<void> {
  try {
    const alerts = await db
      .select()
      .from(stockAlertsTable)
      .where(
        and(
          eq(stockAlertsTable.productId, productId),
          isNull(stockAlertsTable.notifiedAt)
        )
      );

    for (const alert of alerts) {
      await sendBackInStockEmail({
        customerEmail: alert.customerEmail,
        customerName: alert.customerName ?? "Researcher",
        productName,
      });

      await db
        .update(stockAlertsTable)
        .set({ notifiedAt: new Date() })
        .where(eq(stockAlertsTable.id, alert.id));
    }
  } catch {
  }
}

export default router;
