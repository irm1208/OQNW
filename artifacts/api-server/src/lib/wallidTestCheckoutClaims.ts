import { adminTestPaymentClaimsTable, db } from "@workspace/db";

/**
 * Atomically claim a Wallid test checkout session in shared storage before
 * creating the hosted payment or mutating the order.
 */
export async function claimWallidTestCheckoutSession(
  sessionId: string,
  expiresAt: number,
  now = Date.now(),
): Promise<boolean> {
  if (expiresAt <= now) return false;

  const inserted = await db
    .insert(adminTestPaymentClaimsTable)
    .values({
      sessionId,
      paymentMethod: "wallid",
      expiresAt: new Date(expiresAt),
    })
    .onConflictDoNothing({ target: adminTestPaymentClaimsTable.sessionId })
    .returning({ sessionId: adminTestPaymentClaimsTable.sessionId });

  return inserted.length === 1;
}