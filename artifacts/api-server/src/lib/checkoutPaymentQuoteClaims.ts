import { createHash } from "node:crypto";
import { checkoutPaymentQuoteClaimsTable, db } from "@workspace/db";
import { lt } from "drizzle-orm";

export function checkoutPaymentQuoteTokenDigest(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Atomically claims a signed checkout quote in shared storage. The digest
 * primary key makes the claim one-time across concurrent API replicas without
 * retaining the signed token itself.
 */
export async function claimCheckoutPaymentQuote(
  token: string,
  expiresAt: number,
  now = Date.now(),
): Promise<boolean> {
  if (expiresAt <= now) return false;

  await db
    .delete(checkoutPaymentQuoteClaimsTable)
    .where(lt(checkoutPaymentQuoteClaimsTable.expiresAt, new Date(now)));

  const inserted = await db
    .insert(checkoutPaymentQuoteClaimsTable)
    .values({
      tokenDigest: checkoutPaymentQuoteTokenDigest(token),
      expiresAt: new Date(expiresAt),
    })
    .onConflictDoNothing({ target: checkoutPaymentQuoteClaimsTable.tokenDigest })
    .returning({ tokenDigest: checkoutPaymentQuoteClaimsTable.tokenDigest });

  return inserted.length === 1;
}