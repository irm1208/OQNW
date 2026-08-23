import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { discountCodesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/discounts/validate", async (req: Request, res: Response): Promise<void> => {
  const { code, cartTotal } = req.body as { code: unknown; cartTotal: unknown };

  if (typeof code !== "string" || !code.trim()) {
    res.status(400).json({ valid: false, error: "Discount code is required" });
    return;
  }
  if (typeof cartTotal !== "number" || cartTotal < 0) {
    res.status(400).json({ valid: false, error: "Invalid cart total" });
    return;
  }

  try {
    const [discount] = await db
      .select()
      .from(discountCodesTable)
      .where(eq(discountCodesTable.code, code.trim().toUpperCase()))
      .limit(1);

    if (!discount) {
      res.status(200).json({ valid: false, error: "Discount code not found" });
      return;
    }

    if (!discount.isActive) {
      res.status(200).json({ valid: false, error: "This discount code is no longer active" });
      return;
    }

    if (discount.expiresAt && discount.expiresAt < new Date()) {
      res.status(200).json({ valid: false, error: "This discount code has expired" });
      return;
    }

    if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
      res.status(200).json({ valid: false, error: "This discount code has reached its usage limit" });
      return;
    }

    const minSpend = discount.minSpend ? parseFloat(String(discount.minSpend)) : null;
    if (minSpend !== null && cartTotal < minSpend) {
      res.status(200).json({
        valid: false,
        error: `Minimum spend of £${minSpend.toFixed(2)} required for this code`,
      });
      return;
    }

    const value = parseFloat(String(discount.value));
    let discountAmount: number;
    if (discount.type === "percentage") {
      discountAmount = Math.round((cartTotal * value) / 100 * 100) / 100;
    } else {
      discountAmount = Math.min(value, cartTotal);
    }

    res.status(200).json({
      valid: true,
      code: discount.code,
      type: discount.type,
      value,
      discountAmount,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to validate discount code");
    res.status(500).json({ valid: false, error: "Internal server error" });
  }
});

export default router;
