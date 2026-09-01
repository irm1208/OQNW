import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { discountCodesTable } from "@workspace/db";
import {
  CreateAdminDiscountBody,
  UpdateAdminDiscountParams,
  UpdateAdminDiscountBody,
  DeleteAdminDiscountParams,
} from "@workspace/api-zod";
import { eq, desc } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function discountToResponse(d: typeof discountCodesTable.$inferSelect) {
  return {
    id: d.id,
    code: d.code,
    type: d.type,
    value: parseFloat(String(d.value)),
    minSpend: d.minSpend ? parseFloat(String(d.minSpend)) : null,
    usageLimit: d.usageLimit ?? null,
    usageCount: d.usageCount,
    expiresAt: d.expiresAt ? d.expiresAt.toISOString() : null,
    isActive: d.isActive,
    createdAt: d.createdAt.toISOString(),
  };
}

router.get("/admin/discounts", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const discounts = await db
      .select()
      .from(discountCodesTable)
      .orderBy(desc(discountCodesTable.createdAt));
    res.status(200).json(discounts.map(discountToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list discounts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/discounts", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const parsed = CreateAdminDiscountBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { code, type, value, minSpend, usageLimit, expiresAt } = parsed.data;
  try {
    const existing = await db
      .select()
      .from(discountCodesTable)
      .where(eq(discountCodesTable.code, code.toUpperCase()));
    if (existing.length > 0) {
      res.status(400).json({ error: "Discount code already exists" });
      return;
    }
    const [created] = await db
      .insert(discountCodesTable)
      .values({
        code: code.toUpperCase(),
        type,
        value: String(value),
        minSpend: minSpend !== undefined ? String(minSpend) : null,
        usageLimit: usageLimit ?? null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning();
    res.status(201).json(discountToResponse(created));
  } catch (err) {
    req.log.error({ err }, "Failed to create discount");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/discounts/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const paramsParsed = UpdateAdminDiscountParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = UpdateAdminDiscountBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  try {
    const updates: Partial<typeof discountCodesTable.$inferInsert> = {};
    const { isActive, usageLimit, expiresAt, minSpend } = bodyParsed.data;
    if (isActive !== undefined) updates.isActive = isActive;
    if (usageLimit !== undefined) updates.usageLimit = usageLimit;
    if (expiresAt !== undefined) updates.expiresAt = new Date(expiresAt);
    if (minSpend !== undefined) updates.minSpend = String(minSpend);

    const [updated] = await db
      .update(discountCodesTable)
      .set(updates)
      .where(eq(discountCodesTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Discount not found" });
      return;
    }
    res.status(200).json(discountToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update discount");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/discounts/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const parsed = DeleteAdminDiscountParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid discount ID" });
    return;
  }
  try {
    const [deleted] = await db
      .delete(discountCodesTable)
      .where(eq(discountCodesTable.id, parsed.data.id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Discount not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete discount");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
