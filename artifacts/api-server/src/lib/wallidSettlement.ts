import { db, ordersTable, wholesaleInvoicesTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";

/**
 * Atomically claims a Wallid settlement and keeps a linked wholesale invoice
 * in sync with the order. Only awaiting-payment orders can be claimed.
 */
export async function claimWallidSettlement(orderId: number): Promise<boolean> {
  return db.transaction(async (tx) => {
    const settled = await tx
      .update(ordersTable)
      .set({ status: "paid", updatedAt: new Date() })
      .where(and(
        eq(ordersTable.id, orderId),
        eq(ordersTable.status, "awaiting_payment"),
      ))
      .returning({ id: ordersTable.id });

    if (settled.length === 0) return false;

    await tx
      .update(wholesaleInvoicesTable)
      .set({ paymentStatus: "paid", updatedAt: new Date() })
      .where(eq(wholesaleInvoicesTable.orderId, orderId));

    return true;
  });
}