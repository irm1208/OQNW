import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import {
  customerCreditsTable,
  customerCreditTransactionsTable,
  customersTable,
} from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
const router = Router();

async function getOrCreateBalance(customerId: number): Promise<number> {
  const [existing] = await db
    .select()
    .from(customerCreditsTable)
    .where(eq(customerCreditsTable.customerId, customerId));

  if (existing) return existing.balancePence;

  await db.insert(customerCreditsTable).values({ customerId, balancePence: 0 });
  return 0;
}

router.get("/admin/customers/:id/credits", async (req: Request, res: Response): Promise<void> => {
  const customerId = parseInt(req.params.id, 10);
  if (isNaN(customerId)) { res.status(400).json({ error: "Invalid customer ID" }); return; }

  try {
    const balancePence = await getOrCreateBalance(customerId);
    const transactions = await db
      .select()
      .from(customerCreditTransactionsTable)
      .where(eq(customerCreditTransactionsTable.customerId, customerId))
      .orderBy(desc(customerCreditTransactionsTable.createdAt))
      .limit(50);

    res.json({ balancePence, transactions });
  } catch (err) {
    req.log.error({ err }, "Failed to get customer credits");
    res.status(500).json({ error: "Failed to get customer credits" });
  }
});

router.post("/admin/customers/:id/credits", async (req: Request, res: Response): Promise<void> => {
  const customerId = parseInt(req.params.id, 10);
  if (isNaN(customerId)) { res.status(400).json({ error: "Invalid customer ID" }); return; }

  const { amountPence, reason, adminNote, orderId } = req.body ?? {};

  if (typeof amountPence !== "number" || !Number.isInteger(amountPence) || amountPence === 0) {
    res.status(400).json({ error: "amountPence must be a non-zero integer" }); return;
  }
  if (typeof reason !== "string" || reason.trim().length === 0 || reason.length > 300) {
    res.status(400).json({ error: "reason must be a non-empty string (max 300 chars)" }); return;
  }

  try {
    const [customer] = await db
      .select({ id: customersTable.id })
      .from(customersTable)
      .where(eq(customersTable.id, customerId));

    if (!customer) { res.status(404).json({ error: "Customer not found" }); return; }

    const currentBalance = await getOrCreateBalance(customerId);
    const newBalance = currentBalance + amountPence;

    if (newBalance < 0) {
      res.status(400).json({ error: "Insufficient credit balance" });
      return;
    }

    await db
      .update(customerCreditsTable)
      .set({ balancePence: newBalance })
      .where(eq(customerCreditsTable.customerId, customerId));

    await db.insert(customerCreditTransactionsTable).values({
      customerId,
      amountPence,
      type: amountPence > 0 ? "credit" : "debit",
      reason,
      adminNote: adminNote ?? null,
      orderId: orderId ?? null,
    });

    res.json({ balancePence: newBalance });
  } catch (err) {
    req.log.error({ err }, "Failed to adjust customer credits");
    res.status(500).json({ error: "Failed to adjust credits" });
  }
});

router.get("/admin/credits", async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await db
      .select({
        customerId: customerCreditsTable.customerId,
        balancePence: customerCreditsTable.balancePence,
        updatedAt: customerCreditsTable.updatedAt,
        firstName: customersTable.firstName,
        lastName: customersTable.lastName,
        email: customersTable.email,
      })
      .from(customerCreditsTable)
      .innerJoin(customersTable, eq(customerCreditsTable.customerId, customersTable.id))
      .orderBy(desc(customerCreditsTable.balancePence));

    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list customer credits");
    res.status(500).json({ error: "Failed to list credits" });
  }
});

export default router;
