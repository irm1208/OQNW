import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { taxRatesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/tax/calculate", async (req: Request, res: Response): Promise<void> => {
  const countryCode = String(req.query.country ?? "").toUpperCase();
  const subtotal = parseFloat(String(req.query.subtotal ?? "0"));

  if (!countryCode) {
    res.json({ rate: 0, taxAmount: 0, isInclusive: true, name: null });
    return;
  }

  try {
    const [taxRate] = await db
      .select()
      .from(taxRatesTable)
      .where(and(eq(taxRatesTable.countryCode, countryCode), eq(taxRatesTable.isActive, true)))
      .limit(1);

    if (!taxRate) {
      res.json({ rate: 0, taxAmount: 0, isInclusive: true, name: null });
      return;
    }

    const rate = parseFloat(String(taxRate.rate));
    let taxAmount = 0;
    if (taxRate.isInclusive) {
      taxAmount = Math.round((subtotal - subtotal / (1 + rate / 100)) * 100) / 100;
    } else {
      taxAmount = Math.round(subtotal * (rate / 100) * 100) / 100;
    }

    res.json({
      rateId: taxRate.id,
      name: taxRate.name,
      rate,
      isInclusive: taxRate.isInclusive,
      taxAmount,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to calculate tax");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
