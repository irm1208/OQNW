import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminAuthRouter, { isRecentSecureAdminSession, validateSecureAdminSession } from "./admin/auth";
import adminDashboardRouter from "./admin/dashboard";
import adminOrdersRouter from "./admin/orders";
import adminFulfillmentRouter from "./admin/fulfillment";
import adminCustomersRouter from "./admin/customers";
import adminProductsRouter from "./admin/products";
import adminDiscountsRouter from "./admin/discounts";
import catalogRouter from "./admin/catalog";
import adminReturnsRouter from "./admin/returns";
import adminTaxRouter from "./admin/tax";
import adminShippingRouter from "./admin/shipping";
import adminRefundsRouter from "./admin/refunds";
import adminInventoryAuditRouter from "./admin/inventory-audit";
import adminExportRouter from "./admin/export";
import adminWebhooksRouter from "./admin/webhooks";
import adminSettingsRouter from "./admin/settings";
import adminUsersRouter from "./admin/users";
import adminReportsRouter from "./admin/reports";
import adminGdprRouter from "./admin/gdpr";
import adminBlogRouter from "./admin/blog";
import publicOrdersRouter from "./orders";
import publicDiscountsRouter from "./discounts";
import customerAuthRouter from "./auth";
import customerAccountRouter from "./account";
import publicReviewsRouter from "./reviews";
import adminReviewsRouter from "./admin/reviews";
import wishlistRouter from "./wishlist";
import publicReturnsRouter from "./returns";
import productsRouter from "./products";
import cartRouter from "./cart";
import stockAlertsRouter from "./stock-alerts";
import adminAbandonedCartsRouter from "./admin/abandonedCarts";
import adminAlertsRouter from "./admin/alerts";
import adminCreditsRouter from "./admin/credits";
import adminFraudRouter from "./admin/fraud";
import adminBlockedIpsRouter from "./admin/blockedIps";
import adminEmailLogsRouter from "./admin/emailLogs";

import loyaltyRouter from "./loyalty";
import taxRouter from "./tax";
import shippingRouter from "./shipping";
import blogRouter from "./blog";
import btcpayWebhookRouter from "./btcpay-webhook";
import wallidWebhookRouter from "./wallid-webhook";
import contactRouter from "./contact";
import addressLookupRouter from "./address-lookup";
import cryptoPaymentsRouter from "./crypto-payments";
import adminCryptoAuditsRouter from "./admin/crypto-audits";
import adminPublicTrafficRouter from "./admin/publicTraffic";
import adminSecurityRouter from "./admin/security";
import adminWholesaleRouter from "./admin/wholesale";
import publicTrafficRouter from "./publicTraffic";

const router: IRouter = Router();

router.use(healthRouter);
router.use(publicTrafficRouter);
router.use(adminAuthRouter);
// Every remaining /admin endpoint must pass the signed, expiring session check.
// Individual route-level checks remain as defense in depth during migration.
router.use("/admin", async (req, res, next) => {
  if (!(await validateSecureAdminSession(req))) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  // Creating a manual wholesale payment is already protected by the signed
  // admin session above. Do not interrupt an active admin session with a
  // second login just because its recent-auth window has elapsed.
  const isManualWholesaleCreation =
    req.method === "POST" && req.path === "/wholesale";
  if (
    ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
    !isManualWholesaleCreation &&
    !isRecentSecureAdminSession(req)
  ) {
    res.status(401).json({ error: "Recent authentication required", requiresRecentAuth: true });
    return;
  }
  // Preserve route-level defence in depth without trusting or mutating cookies.
  res.locals.adminAuthenticated = true;
  next();
});
router.use(adminDashboardRouter);
router.use(adminOrdersRouter);
router.use(adminFulfillmentRouter);
router.use(adminCustomersRouter);
router.use(adminProductsRouter);
router.use(adminDiscountsRouter);
router.use(catalogRouter);
router.use(adminReturnsRouter);
router.use(adminTaxRouter);
router.use(adminShippingRouter);
router.use(adminRefundsRouter);
router.use(adminInventoryAuditRouter);
router.use(adminExportRouter);
router.use(adminWebhooksRouter);
router.use(adminSettingsRouter);
router.use(adminUsersRouter);
router.use(adminReportsRouter);
router.use(adminGdprRouter);
router.use(adminBlogRouter);
  router.use(adminCryptoAuditsRouter);
router.use(publicOrdersRouter);
  router.use(cryptoPaymentsRouter);
router.use(publicDiscountsRouter);
router.use(customerAuthRouter);
router.use(customerAccountRouter);
router.use(publicReviewsRouter);
router.use(adminReviewsRouter);
router.use(wishlistRouter);
router.use(publicReturnsRouter);
router.use(productsRouter);
router.use(cartRouter);
router.use(stockAlertsRouter);
router.use(adminAbandonedCartsRouter);
router.use(adminAlertsRouter);
router.use(adminCreditsRouter);
router.use(adminFraudRouter);
router.use(adminBlockedIpsRouter);
router.use(adminPublicTrafficRouter);
router.use(adminSecurityRouter);
router.use(adminWholesaleRouter);
router.use(adminEmailLogsRouter);

router.use(loyaltyRouter);
router.use(taxRouter);
router.use(shippingRouter);
router.use(blogRouter);
router.use(btcpayWebhookRouter);
router.use(wallidWebhookRouter);
router.use(contactRouter);
router.use(addressLookupRouter);

export default router;
