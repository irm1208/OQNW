import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { abandonedCartsTable } from "@workspace/db";
import { and, eq, isNull, desc } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

router.get("/admin/abandoned-carts", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  try {
    const carts = await db
      .select()
      .from(abandonedCartsTable)
      .where(and(isNull(abandonedCartsTable.convertedAt), isNull(abandonedCartsTable.archivedAt)))
      .orderBy(desc(abandonedCartsTable.updatedAt));

    interface CartItem {
      productName?: string;
      quantity?: number;
      priceGbp?: number;
    }

    const rows = carts.map((c) => {
      let items: CartItem[] = [];
      try { items = JSON.parse(c.itemsJson) as CartItem[]; } catch { items = []; }
      const totalValue = items.reduce((s, i) => s + ((i.priceGbp ?? 0) * (i.quantity ?? 1)), 0);
      return {
        id: c.id,
        customerEmail: c.customerEmail,
        customerName: c.customerName,
        itemCount: items.length,
        totalValue,
        updatedAt: c.updatedAt.toISOString(),
        emailSentAt: c.emailSentAt?.toISOString() ?? null,
        items: items.map((i) => ({ productName: i.productName ?? "", quantity: i.quantity ?? 1, priceGbp: i.priceGbp ?? 0 })),
      };
    });

    const totalAbandonedValue = rows.reduce((s, r) => s + r.totalValue, 0);
    const emailsSent = rows.filter((r) => r.emailSentAt !== null).length;
    const pendingEmail = rows.filter((r) => r.emailSentAt === null).length;

    res.json({ carts: rows, stats: { total: rows.length, totalAbandonedValue, emailsSent, pendingEmail } });
  } catch (err) {
    req.log.error({ err }, "Failed to list abandoned carts");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Archive retains the recovery history while removing an obsolete cart from the queue.
router.post("/admin/abandoned-carts/:id/archive", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) { res.status(400).json({ error: "Invalid cart ID" }); return; }
  try {
    const [archived] = await db.update(abandonedCartsTable)
      .set({ archivedAt: new Date() })
      .where(and(eq(abandonedCartsTable.id, id), isNull(abandonedCartsTable.convertedAt), isNull(abandonedCartsTable.archivedAt)))
      .returning({ id: abandonedCartsTable.id });
    if (!archived) { res.status(409).json({ error: "Cart is already converted or archived" }); return; }
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to archive abandoned cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
