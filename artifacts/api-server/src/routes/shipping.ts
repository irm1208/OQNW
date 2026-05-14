import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { shippingZonesTable, shippingRatesTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";

const router = Router();

router.get("/shipping/rates", async (req: Request, res: Response): Promise<void> => {
  const country = String(req.query.country ?? "").toUpperCase();
  const orderTotal = parseFloat(String(req.query.orderTotal ?? "0"));

  if (!country) {
    res.json({ rates: [] });
    return;
  }

  try {
    const zones = await db
      .select()
      .from(shippingZonesTable)
      .where(and(
        eq(shippingZonesTable.isActive, true),
        sql`${country} = ANY(${shippingZonesTable.countryCodes})`
      ));

    if (zones.length === 0) {
      res.json({ rates: [] });
      return;
    }

    const zoneIds = zones.map(z => z.id);
    const allRates = await db
      .select()
      .from(shippingRatesTable)
      .where(and(
        eq(shippingRatesTable.isActive, true),
        sql`${shippingRatesTable.zoneId} = ANY(${sql.raw(`ARRAY[${zoneIds.join(",")}]::int[]`)})`
      ));

    const rates = allRates.map(r => {
      const basePrice = parseFloat(String(r.priceGbp));
      const freeAbove = r.freeAboveGbp != null ? parseFloat(String(r.freeAboveGbp)) : null;
      const effectivePrice = freeAbove != null && orderTotal >= freeAbove ? 0 : basePrice;
      return {
        id: r.id,
        name: r.name,
        carrier: r.carrier,
        priceGbp: effectivePrice,
        originalPriceGbp: basePrice,
        isFreeShipping: freeAbove != null && orderTotal >= freeAbove,
        freeAboveGbp: freeAbove,
        estimatedDaysMin: r.estimatedDaysMin,
        estimatedDaysMax: r.estimatedDaysMax,
      };
    });

    res.json({ rates });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch shipping rates");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
