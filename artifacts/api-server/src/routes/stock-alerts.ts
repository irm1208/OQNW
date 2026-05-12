import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { stockAlertsTable } from "@workspace/db";
import { and, eq, isNull } from "drizzle-orm";
import { sendBackInStockEmail } from "../lib/email";

const router = Router();

router.post("/api/products/:productId/stock-alert", async (req: Request, res: Response): Promise<void> => {
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

router.delete("/api/products/:productId/stock-alert", async (req: Request, res: Response): Promise<void> => {
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
