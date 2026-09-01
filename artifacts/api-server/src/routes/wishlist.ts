import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { requiredSecret } from "../lib/securityConfig";
import { db } from "@workspace/db";
import { wishlistsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { firstString } from "../lib/query";

const router = Router();

const SESSION_SECRET = requiredSecret("SESSION_SECRET", "omniqure-cust-session-development-only");
const COOKIE_NAME = "customer_session";

function getCustomerId(req: Request): number | null {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  if (sig !== expected) return null;
  const id = parseInt(payload, 10);
  return isNaN(id) ? null : id;
}

router.get("/wishlist", async (req: Request, res: Response): Promise<void> => {
  const customerId = getCustomerId(req);
  if (!customerId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const rows = await db
      .select({ productId: wishlistsTable.productId })
      .from(wishlistsTable)
      .where(eq(wishlistsTable.customerId, customerId));
    res.json({ productIds: rows.map((r) => r.productId) });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/wishlist/:productId", async (req: Request, res: Response): Promise<void> => {
  const customerId = getCustomerId(req);
  if (!customerId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const productId = parseInt(firstString(req.params.productId) ?? "", 10);
  if (isNaN(productId)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }
  try {
    await db
      .insert(wishlistsTable)
      .values({ customerId, productId })
      .onConflictDoNothing();
    res.status(201).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to add to wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/wishlist/:productId", async (req: Request, res: Response): Promise<void> => {
  const customerId = getCustomerId(req);
  if (!customerId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const productId = parseInt(firstString(req.params.productId) ?? "", 10);
  if (isNaN(productId)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }
  try {
    await db
      .delete(wishlistsTable)
      .where(and(eq(wishlistsTable.customerId, customerId), eq(wishlistsTable.productId, productId)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to remove from wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
