import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { shippingZonesTable, shippingRatesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function zoneToResponse(z: typeof shippingZonesTable.$inferSelect) {
  return {
    id: z.id,
    name: z.name,
    description: z.description ?? null,
    countryCodes: z.countryCodes ?? [],
    isActive: z.isActive,
    createdAt: z.createdAt.toISOString(),
  };
}

function rateToResponse(r: typeof shippingRatesTable.$inferSelect) {
  return {
    id: r.id,
    zoneId: r.zoneId,
    name: r.name,
    carrier: r.carrier,
    priceGbp: parseFloat(String(r.priceGbp)),
    freeAboveGbp: r.freeAboveGbp != null ? parseFloat(String(r.freeAboveGbp)) : null,
    estimatedDaysMin: r.estimatedDaysMin,
    estimatedDaysMax: r.estimatedDaysMax,
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/admin/shipping/zones", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const zones = await db.select().from(shippingZonesTable).orderBy(desc(shippingZonesTable.createdAt));
    res.json(zones.map(zoneToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list shipping zones");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/shipping/zones", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { name, description, countryCodes } = req.body as {
    name: string; description?: string; countryCodes: string[];
  };
  if (!name || !Array.isArray(countryCodes)) {
    res.status(400).json({ error: "name and countryCodes are required" });
    return;
  }
  try {
    const [created] = await db
      .insert(shippingZonesTable)
      .values({ name, description: description ?? null, countryCodes: countryCodes.map(c => c.toUpperCase()) })
      .returning();
    res.status(201).json(zoneToResponse(created));
  } catch (err) {
    req.log.error({ err }, "Failed to create shipping zone");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/shipping/zones/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const { name, description, countryCodes, isActive } = req.body as Partial<{
    name: string; description: string; countryCodes: string[]; isActive: boolean;
  }>;
  const updates: Partial<typeof shippingZonesTable.$inferInsert> = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (countryCodes !== undefined) updates.countryCodes = countryCodes.map(c => c.toUpperCase());
  if (isActive !== undefined) updates.isActive = isActive;
  try {
    const [updated] = await db.update(shippingZonesTable).set(updates).where(eq(shippingZonesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Zone not found" }); return; }
    res.json(zoneToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update shipping zone");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/shipping/zones/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [deleted] = await db.delete(shippingZonesTable).where(eq(shippingZonesTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "Zone not found" }); return; }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete shipping zone");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/shipping/rates", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const rates = await db.select().from(shippingRatesTable).orderBy(desc(shippingRatesTable.createdAt));
    res.json(rates.map(rateToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list shipping rates");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/shipping/rates", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { zoneId, name, carrier, priceGbp, freeAboveGbp, estimatedDaysMin, estimatedDaysMax } = req.body as {
    zoneId: number; name: string; carrier?: string; priceGbp: number;
    freeAboveGbp?: number; estimatedDaysMin?: number; estimatedDaysMax?: number;
  };
  if (!zoneId || !name || priceGbp == null) {
    res.status(400).json({ error: "zoneId, name and priceGbp are required" });
    return;
  }
  try {
    const [created] = await db
      .insert(shippingRatesTable)
      .values({
        zoneId,
        name,
        carrier: carrier ?? "Royal Mail",
        priceGbp: String(priceGbp),
        freeAboveGbp: freeAboveGbp != null ? String(freeAboveGbp) : null,
        estimatedDaysMin: estimatedDaysMin ?? 2,
        estimatedDaysMax: estimatedDaysMax ?? 5,
      })
      .returning();
    res.status(201).json(rateToResponse(created));
  } catch (err) {
    req.log.error({ err }, "Failed to create shipping rate");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/shipping/rates/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const { name, carrier, priceGbp, freeAboveGbp, estimatedDaysMin, estimatedDaysMax, isActive } = req.body as Partial<{
    name: string; carrier: string; priceGbp: number; freeAboveGbp: number | null;
    estimatedDaysMin: number; estimatedDaysMax: number; isActive: boolean;
  }>;
  const updates: Partial<typeof shippingRatesTable.$inferInsert> = {};
  if (name !== undefined) updates.name = name;
  if (carrier !== undefined) updates.carrier = carrier;
  if (priceGbp !== undefined) updates.priceGbp = String(priceGbp);
  if (freeAboveGbp !== undefined) updates.freeAboveGbp = freeAboveGbp != null ? String(freeAboveGbp) : null;
  if (estimatedDaysMin !== undefined) updates.estimatedDaysMin = estimatedDaysMin;
  if (estimatedDaysMax !== undefined) updates.estimatedDaysMax = estimatedDaysMax;
  if (isActive !== undefined) updates.isActive = isActive;
  try {
    const [updated] = await db.update(shippingRatesTable).set(updates).where(eq(shippingRatesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Rate not found" }); return; }
    res.json(rateToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update shipping rate");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/shipping/rates/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [deleted] = await db.delete(shippingRatesTable).where(eq(shippingRatesTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "Rate not found" }); return; }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete shipping rate");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
