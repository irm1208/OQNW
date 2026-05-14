import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { giftCardsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { sendGiftCardToRecipient, sendGiftCardPurchaserConfirmation } from "../lib/email";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

function generateGiftCardCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = crypto.randomBytes(16);
  for (let i = 0; i < 16; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 16)}`;
}

// POST /api/gift-cards/purchase — create a gift card
router.post("/gift-cards/purchase", async (req: Request, res: Response): Promise<void> => {
  const { purchaserEmail, recipientEmail, recipientName, message, amountGbp } = req.body as {
    purchaserEmail?: unknown;
    recipientEmail?: unknown;
    recipientName?: unknown;
    message?: unknown;
    amountGbp?: unknown;
  };

  if (typeof purchaserEmail !== "string" || !purchaserEmail.includes("@")) {
    res.status(400).json({ error: "Valid purchaser email is required" });
    return;
  }
  if (typeof recipientEmail !== "string" || !recipientEmail.includes("@")) {
    res.status(400).json({ error: "Valid recipient email is required" });
    return;
  }
  if (typeof amountGbp !== "number" || amountGbp < 10 || amountGbp > 500) {
    res.status(400).json({ error: "Gift card amount must be between £10 and £500" });
    return;
  }

  try {
    let code = generateGiftCardCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await db.select({ id: giftCardsTable.id }).from(giftCardsTable).where(eq(giftCardsTable.code, code)).limit(1);
      if (existing.length === 0) break;
      code = generateGiftCardCode();
      attempts++;
    }

    const [card] = await db.insert(giftCardsTable).values({
      code,
      amountGbp: String(amountGbp),
      remainingGbp: String(amountGbp),
      purchaserEmail: purchaserEmail.toLowerCase().trim(),
      recipientEmail: recipientEmail.toLowerCase().trim(),
      recipientName: typeof recipientName === "string" ? recipientName.trim() || null : null,
      message: typeof message === "string" ? message.trim() || null : null,
      isActive: true,
    }).returning();

    await sendGiftCardToRecipient({
      recipientEmail: card.recipientEmail,
      recipientName: card.recipientName ?? "Researcher",
      purchaserEmail: card.purchaserEmail,
      code: card.code,
      amountGbp,
      message: card.message ?? null,
    });

    await sendGiftCardPurchaserConfirmation({
      purchaserEmail: card.purchaserEmail,
      recipientEmail: card.recipientEmail,
      recipientName: card.recipientName ?? null,
      code: card.code,
      amountGbp,
    });

    req.log.info({ code: card.code, amount: amountGbp }, "Gift card created");
    res.status(201).json({ ok: true, code: card.code });
  } catch (err) {
    req.log.error({ err }, "Failed to create gift card");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/gift-cards/validate/:code — validate a gift card at checkout
router.get("/gift-cards/validate/:code", async (req: Request, res: Response): Promise<void> => {
  const code = (req.params.code as string).toUpperCase().trim();
  try {
    const [card] = await db.select().from(giftCardsTable).where(eq(giftCardsTable.code, code)).limit(1);
    if (!card || !card.isActive) {
      res.json({ valid: false, error: "Gift card not found or has been deactivated" });
      return;
    }
    const remaining = parseFloat(String(card.remainingGbp));
    if (remaining <= 0) {
      res.json({ valid: false, error: "This gift card has no remaining balance" });
      return;
    }
    res.json({ valid: true, remainingGbp: remaining, amountGbp: parseFloat(String(card.amountGbp)) });
  } catch (err) {
    req.log.error({ err }, "Failed to validate gift card");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/gift-cards — list all gift cards
router.get("/admin/gift-cards", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const cards = await db.select().from(giftCardsTable).orderBy(desc(giftCardsTable.createdAt)).limit(200);
    const total = cards.reduce((s, c) => s + parseFloat(String(c.amountGbp)), 0);
    const redeemed = cards.reduce((s, c) => s + (parseFloat(String(c.amountGbp)) - parseFloat(String(c.remainingGbp))), 0);
    const outstanding = cards.filter(c => c.isActive && parseFloat(String(c.remainingGbp)) > 0)
      .reduce((s, c) => s + parseFloat(String(c.remainingGbp)), 0);
    res.json({
      stats: {
        totalIssued: cards.length,
        totalValueGbp: total,
        redeemedGbp: redeemed,
        outstandingGbp: outstanding,
        activeCount: cards.filter(c => c.isActive && parseFloat(String(c.remainingGbp)) > 0).length,
      },
      cards: cards.map(c => ({
        id: c.id,
        code: c.code,
        amountGbp: parseFloat(String(c.amountGbp)),
        remainingGbp: parseFloat(String(c.remainingGbp)),
        purchaserEmail: c.purchaserEmail,
        recipientEmail: c.recipientEmail,
        recipientName: c.recipientName,
        message: c.message,
        isActive: c.isActive,
        createdAt: c.createdAt.toISOString(),
        redeemedAt: c.redeemedAt?.toISOString() ?? null,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list gift cards");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/gift-cards/:id/deactivate
router.patch("/admin/gift-cards/:id/deactivate", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    await db.update(giftCardsTable).set({ isActive: false }).where(eq(giftCardsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to deactivate gift card");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
