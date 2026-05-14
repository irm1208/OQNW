import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { taxRatesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function rateToResponse(r: typeof taxRatesTable.$inferSelect) {
  return {
    id: r.id,
    name: r.name,
    countryCode: r.countryCode,
    countryName: r.countryName,
    region: r.region ?? null,
    rate: parseFloat(String(r.rate)),
    isInclusive: r.isInclusive,
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

router.get("/admin/tax-rates", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const rates = await db.select().from(taxRatesTable).orderBy(desc(taxRatesTable.createdAt));
    res.json(rates.map(rateToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list tax rates");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/tax-rates", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { name, countryCode, countryName, region, rate, isInclusive } = req.body as {
    name: string;
    countryCode: string;
    countryName: string;
    region?: string;
    rate: number;
    isInclusive: boolean;
  };
  if (!name || !countryCode || !countryName || rate == null) {
    res.status(400).json({ error: "name, countryCode, countryName and rate are required" });
    return;
  }
  try {
    const [created] = await db
      .insert(taxRatesTable)
      .values({
        name,
        countryCode: countryCode.toUpperCase(),
        countryName,
        region: region ?? null,
        rate: String(rate),
        isInclusive: isInclusive ?? true,
      })
      .returning();
    res.status(201).json(rateToResponse(created));
  } catch (err) {
    req.log.error({ err }, "Failed to create tax rate");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/tax-rates/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const { name, countryCode, countryName, region, rate, isInclusive, isActive } = req.body as Partial<{
    name: string; countryCode: string; countryName: string; region: string;
    rate: number; isInclusive: boolean; isActive: boolean;
  }>;
  const updates: Partial<typeof taxRatesTable.$inferInsert> = {};
  if (name !== undefined) updates.name = name;
  if (countryCode !== undefined) updates.countryCode = countryCode.toUpperCase();
  if (countryName !== undefined) updates.countryName = countryName;
  if (region !== undefined) updates.region = region;
  if (rate !== undefined) updates.rate = String(rate);
  if (isInclusive !== undefined) updates.isInclusive = isInclusive;
  if (isActive !== undefined) updates.isActive = isActive;
  try {
    const [updated] = await db.update(taxRatesTable).set(updates).where(eq(taxRatesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Tax rate not found" }); return; }
    res.json(rateToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update tax rate");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/tax-rates/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [deleted] = await db.delete(taxRatesTable).where(eq(taxRatesTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "Tax rate not found" }); return; }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete tax rate");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
