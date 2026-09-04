import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./logger";

export const ADMIN_ALERT_READ_RETENTION_MS = 180 * 24 * 60 * 60 * 1000;
export const ADMIN_ALERT_READ_CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000;
export const ADMIN_ALERT_READ_CLEANUP_BATCH_SIZE = 500;
export const ADMIN_ALERT_READ_CLEANUP_LOCK_KEY = 731905242;

type LockRow = { acquired: boolean };
type DeleteRow = { id: number };

export async function cleanupOldAdminAlertReads(now = new Date()): Promise<number> {
  const cutoff = new Date(now.getTime() - ADMIN_ALERT_READ_RETENTION_MS);

  return db.transaction(async (tx) => {
    const lockResult = await tx.execute<LockRow>(sql`
      SELECT pg_try_advisory_xact_lock(${ADMIN_ALERT_READ_CLEANUP_LOCK_KEY}) AS acquired
    `);
    if (lockResult.rows[0]?.acquired !== true) {
      logger.debug("Admin alert read cleanup skipped because another replica holds the lock");
      return 0;
    }

    let deletedCount = 0;
    let batchCount = 0;

    while (true) {
      const deleted = await tx.execute<DeleteRow>(sql`
        WITH expired AS (
          SELECT receipt.id
          FROM admin_alert_reads AS receipt
          WHERE receipt.read_at < ${cutoff}
            AND NOT (
              (
                receipt.alert_id LIKE 'order-%'
                AND EXISTS (
                  SELECT 1
                  FROM orders AS active_order
                  WHERE receipt.alert_id = 'order-' || active_order.id::text
                    AND receipt.alert_created_at = date_trunc('milliseconds', active_order.created_at)
                    AND active_order.status = 'pending'
                )
              )
              OR (
                receipt.alert_id LIKE 'return-%'
                AND EXISTS (
                  SELECT 1
                  FROM returns AS active_return
                  WHERE receipt.alert_id = 'return-' || active_return.id::text
                    AND receipt.alert_created_at = date_trunc('milliseconds', active_return.created_at)
                    AND active_return.status = 'requested'
                )
              )
              OR (
                receipt.alert_id LIKE 'stock-%'
                AND EXISTS (
                  SELECT 1
                  FROM products_inventory AS active_stock
                  WHERE receipt.alert_id = 'stock-' || active_stock.id::text
                    AND receipt.alert_created_at = date_trunc('milliseconds', active_stock.updated_at)
                    AND active_stock.stock_level <= active_stock.low_stock_threshold
                )
              )
              OR (
                receipt.alert_id LIKE 'cart-%'
                AND EXISTS (
                  SELECT 1
                  FROM abandoned_carts AS active_cart
                  WHERE receipt.alert_id = 'cart-' || active_cart.id::text
                    AND receipt.alert_created_at = date_trunc('milliseconds', active_cart.updated_at)
                    AND active_cart.converted_at IS NULL
                )
              )
              OR (
                receipt.alert_id LIKE 'fraud-%'
                AND EXISTS (
                  SELECT 1
                  FROM orders AS active_fraud_order
                  WHERE receipt.alert_id = 'fraud-' || active_fraud_order.id::text
                    AND receipt.alert_created_at = date_trunc('milliseconds', active_fraud_order.created_at)
                    AND active_fraud_order.fraud_score >= 40
                    AND active_fraud_order.fraud_reviewed = false
                )
              )
            )
          ORDER BY receipt.read_at, receipt.id
          LIMIT ${ADMIN_ALERT_READ_CLEANUP_BATCH_SIZE}
          FOR UPDATE OF receipt SKIP LOCKED
        )
        DELETE FROM admin_alert_reads AS receipt
        USING expired
        WHERE receipt.id = expired.id
        RETURNING receipt.id
      `);

      deletedCount += deleted.rows.length;
      batchCount += 1;
      if (deleted.rows.length < ADMIN_ALERT_READ_CLEANUP_BATCH_SIZE) break;
    }

    logger.info(
      {
        deletedCount,
        batchCount,
        cutoff: cutoff.toISOString(),
        batchSize: ADMIN_ALERT_READ_CLEANUP_BATCH_SIZE,
      },
      "Admin alert read cleanup completed",
    );
    return deletedCount;
  });
}

async function runCleanup(): Promise<void> {
  try {
    await cleanupOldAdminAlertReads();
  } catch (err) {
    logger.error({ err }, "Admin alert read cleanup failed");
  }
}

export function startAdminAlertReadCleanupJob(): void {
  logger.info(
    {
      retentionDays: ADMIN_ALERT_READ_RETENTION_MS / (24 * 60 * 60 * 1000),
      intervalMs: ADMIN_ALERT_READ_CLEANUP_INTERVAL_MS,
      batchSize: ADMIN_ALERT_READ_CLEANUP_BATCH_SIZE,
    },
    "Admin alert read cleanup job started",
  );
  void runCleanup();
  const timer = setInterval(() => {
    void runCleanup();
  }, ADMIN_ALERT_READ_CLEANUP_INTERVAL_MS);
  timer.unref();
}