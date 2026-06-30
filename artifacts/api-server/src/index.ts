import app from "./app";
import { logger } from "./lib/logger";
import { startAbandonedCartJob } from "./lib/abandonedCartJob";
import { startReviewRequestJob } from "./lib/reviewRequestJob";
import { startSubscriptionJob } from "./lib/subscriptionJob";
import { seedReviews } from "./lib/seed-reviews";
import { seedBlog } from "./lib/seed-blog";
import { seedBlogPeptides } from "./lib/seed-blog-peptides";

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
  startReviewRequestJob();
  startSubscriptionJob();
  seedReviews().then((r) => {
    if (r.seeded) logger.info({ count: r.count }, "Reviews seeded");
    else logger.info({ reason: r.reason }, "Reviews seed skipped");
  }).catch((err) => logger.error({ err }, "Reviews seed failed"));
  seedBlog().catch((err) => logger.error({ err }, "Blog seed failed"));
  seedBlogPeptides().catch((err) => logger.error({ err }, "Blog peptides seed failed"));
});
