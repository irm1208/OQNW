import { adminTestPaymentClaimsTable, db } from "@workspace/db";

export async function claimCryptoTestCheckoutSession(
  sessionId: string,
  expiresAt: number,
  now = Date.now(),
): Promise<boolean> {
  if (expiresAt <= now) return false;

  const inserted = await db
    .insert(adminTestPaymentClaimsTable)
    .values({
      sessionId,
      paymentMethod: "crypto",
      expiresAt: new Date(expiresAt),
    })
    .onConflictDoNothing({ target: adminTestPaymentClaimsTable.sessionId })
    .returning({ sessionId: adminTestPaymentClaimsTable.sessionId });

  return inserted.length === 1;
}