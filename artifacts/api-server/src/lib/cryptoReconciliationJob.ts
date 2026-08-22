import { logger } from "./logger";
import { reconcilePendingCryptoPayments } from "../routes/crypto-payments";

const INTERVAL_MS = 5 * 60 * 1000;

async function runCheck(): Promise<void> {
  try {
    const checked = await reconcilePendingCryptoPayments();
    if (checked > 0) logger.info({ checked }, "Crypto payment reconciliation completed");
  } catch (err) {
    logger.error({ err }, "Crypto payment reconciliation failed");
  }
}

export function startCryptoReconciliationJob(): void {
  logger.info("Crypto payment reconciliation job started");
  void runCheck();
  setInterval(() => { void runCheck(); }, INTERVAL_MS);
}