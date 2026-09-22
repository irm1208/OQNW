import app from "./app";
import { logger } from "./lib/logger";
import { startAbandonedCartJob } from "./lib/abandonedCartJob";
import { seedBlog } from "./lib/seed-blog";
import { seedBlogPeptides } from "./lib/seed-blog-peptides";
import { seedProductsCatalog } from "./lib/seed-catalog";
import { retireRemovedProducts } from "./lib/retiredProducts";
import { startCryptoReconciliationJob } from "./lib/cryptoReconciliationJob";
import { startWallidReconciliationJob } from "./lib/wallidReconciliationJob";
import { startAdminAlertReadCleanupJob } from "./lib/adminAlertReadCleanupJob";
import { applyInventoryStockSnapshot } from "./lib/apply-inventory-stock-snapshot";
import { startDatabaseBackupJob } from "./lib/databaseBackupJob";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  startAbandonedCartJob();
  startCryptoReconciliationJob();
  startWallidReconciliationJob();
  startAdminAlertReadCleanupJob();
  startDatabaseBackupJob();
  // Seed catalog before applying dependent startup data.
  seedProductsCatalog()
    .then(async (r) => {
      if (r.seeded) logger.info({ count: r.count }, "Products catalog seeded");
      else logger.info({ reason: r.reason }, "Products catalog seed skipped");
      const stockPatch = await applyInventoryStockSnapshot();
      if (stockPatch.applied) {
        logger.info({ count: stockPatch.updated }, "Inventory stock snapshot applied");
      }
      const retiredCount = await retireRemovedProducts();
      if (retiredCount > 0) logger.info({ retiredCount }, "Removed products retired");
    })
    .catch((err) => logger.error({ err }, "Catalog seed failed"));
  seedBlog().catch((err) => logger.error({ err }, "Blog seed failed"));
  seedBlogPeptides().catch((err) => logger.error({ err }, "Blog peptides seed failed"));
});
