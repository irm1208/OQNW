import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { inventoryAuditLogTable } from "@workspace/db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

router.get("/admin/inventory/audit-log", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const productId = req.query.productId ? parseInt(String(req.query.productId), 10) : null;
  const changeType = typeof req.query.changeType === "string" ? req.query.changeType : null;
  const from = typeof req.query.from === "string" ? req.query.from : null;
  const to = typeof req.query.to === "string" ? req.query.to : null;
  const limit = Math.min(parseInt(String(req.query.limit ?? "100"), 10), 500);
  const offset = parseInt(String(req.query.offset ?? "0"), 10);

  try {
    const conditions = [];
    if (productId) conditions.push(eq(inventoryAuditLogTable.productId, productId));
    if (changeType) conditions.push(eq(inventoryAuditLogTable.changeType, changeType));
    if (from) conditions.push(gte(inventoryAuditLogTable.createdAt, new Date(from)));
    if (to) conditions.push(lte(inventoryAuditLogTable.createdAt, new Date(to)));

    const [rows, [{ total }]] = await Promise.all([
      db
        .select()
        .from(inventoryAuditLogTable)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(inventoryAuditLogTable.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(inventoryAuditLogTable)
        .where(conditions.length ? and(...conditions) : undefined),
    ]);

    res.json({
      total,
      entries: rows.map(r => ({
        id: r.id,
        productId: r.productId,
        productName: r.productName,
        changeType: r.changeType,
        quantityBefore: r.quantityBefore,
        quantityAfter: r.quantityAfter,
        quantityChange: r.quantityChange,
        reason: r.reason ?? null,
        referenceId: r.referenceId ?? null,
        referenceType: r.referenceType ?? null,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch inventory audit log");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
