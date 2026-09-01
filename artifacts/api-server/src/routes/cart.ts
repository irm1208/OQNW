import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { requiredSecret } from "../lib/securityConfig";
import { db } from "@workspace/db";
import { abandonedCartsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const SESSION_SECRET = requiredSecret("SESSION_SECRET", "omniqure-cust-session-development-only");

function verifyCustomerSession(token: string): number | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  if (sig !== expected) return null;
  const id = parseInt(payload, 10);
  return isNaN(id) ? null : id;
}

router.post("/cart/save", async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.customer_session as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const customerId = verifyCustomerSession(token);
  if (!customerId) {
    res.status(401).json({ error: "Invalid session" });
    return;
  }

  const { customerEmail, customerName, items } = req.body as {
    customerEmail?: unknown;
    customerName?: unknown;
    items?: unknown;
  };

  if (
    typeof customerEmail !== "string" ||
    typeof customerName !== "string" ||
    !Array.isArray(items)
  ) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  if (items.length === 0) {
    await db
      .delete(abandonedCartsTable)
      .where(eq(abandonedCartsTable.customerId, customerId));
    res.json({ ok: true });
    return;
  }

  await db
    .insert(abandonedCartsTable)
    .values({
      customerId,
      customerEmail: customerEmail.toLowerCase(),
      customerName,
      itemsJson: JSON.stringify(items),
      updatedAt: new Date(),
      emailSentAt: null,
      convertedAt: null,
    })
    .onConflictDoUpdate({
      target: abandonedCartsTable.customerId,
      set: {
        customerEmail: customerEmail.toLowerCase(),
        customerName,
        itemsJson: JSON.stringify(items),
        updatedAt: new Date(),
        emailSentAt: null,
        convertedAt: null,
      },
    });

  res.json({ ok: true });
});

router.delete("/cart/save", async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.customer_session as string | undefined;
  if (!token) {
    res.json({ ok: true });
    return;
  }
  const customerId = verifyCustomerSession(token);
  if (!customerId) {
    res.json({ ok: true });
    return;
  }

  await db
    .update(abandonedCartsTable)
    .set({ convertedAt: new Date() })
    .where(eq(abandonedCartsTable.customerId, customerId));

  res.json({ ok: true });
});

export default router;
