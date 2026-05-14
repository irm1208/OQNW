import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import {
  customersTable,
  ordersTable,
  orderItemsTable,
  wishlistsTable,
  productReviewsTable,
  loyaltyTransactionsTable,
  stockAlertsTable,
  subscriptionsTable,
} from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

router.get("/admin/customers/:id/gdpr-export", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const customerId = parseInt(req.params.id, 10);
  if (isNaN(customerId)) { res.status(400).json({ error: "Invalid ID" }); return; }

  try {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, customerId)).limit(1);
    if (!customer) { res.status(404).json({ error: "Customer not found" }); return; }

    const [orders, reviews, loyalty, alerts, subs] = await Promise.all([
      db.select().from(ordersTable).where(eq(ordersTable.customerId, customerId)).orderBy(desc(ordersTable.createdAt)),
      db.select().from(productReviewsTable).where(eq(productReviewsTable.customerId, customerId)),
      db.select().from(loyaltyTransactionsTable).where(eq(loyaltyTransactionsTable.customerId, customerId)),
      db.select().from(stockAlertsTable).where(eq(stockAlertsTable.customerId, customerId)),
      db.select().from(subscriptionsTable).where(eq(subscriptionsTable.customerId, customerId)),
    ]);

    const orderIds = orders.map(o => o.id);
    const items = orderIds.length > 0
      ? await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orders[0]?.id ?? 0))
      : [];

    const exportData = {
      exportedAt: new Date().toISOString(),
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        address1: customer.address1,
        address2: customer.address2,
        city: customer.city,
        county: customer.county,
        postcode: customer.postcode,
        country: customer.country,
        totalOrders: customer.totalOrders,
        totalSpentGbp: parseFloat(String(customer.totalSpentGbp ?? 0)),
        createdAt: customer.createdAt,
      },
      orders: orders.map(o => ({
        orderNumber: o.orderNumber,
        status: o.status,
        totalGbp: parseFloat(String(o.totalGbp)),
        country: o.country,
        createdAt: o.createdAt,
      })),
      reviews: reviews.map(r => ({ productId: r.productId, rating: r.rating, title: r.title, body: r.body, createdAt: r.createdAt })),
      loyaltyTransactions: loyalty.map(t => ({ points: t.points, reason: t.reason, createdAt: t.createdAt })),
      stockAlerts: alerts.map(a => ({ productId: a.productId, productName: a.productName, createdAt: a.createdAt })),
      subscriptions: subs.map(s => ({ productName: s.productName, status: s.status, createdAt: s.createdAt })),
    };

    const filename = `gdpr-export-customer-${customerId}-${new Date().toISOString().slice(0, 10)}.json`;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(JSON.stringify(exportData, null, 2));
  } catch (err) {
    req.log.error({ err }, "Failed to export customer GDPR data");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/customers/:id/gdpr-erase", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const customerId = parseInt(req.params.id, 10);
  if (isNaN(customerId)) { res.status(400).json({ error: "Invalid ID" }); return; }

  try {
    const [customer] = await db.select({ id: customersTable.id, email: customersTable.email })
      .from(customersTable).where(eq(customersTable.id, customerId)).limit(1);
    if (!customer) { res.status(404).json({ error: "Customer not found" }); return; }

    const anonymisedEmail = `erased-${customerId}@gdpr.deleted`;
    const anonymisedName = "Erased User";

    await db.update(ordersTable).set({
      customerEmail: anonymisedEmail,
      customerName: anonymisedName,
      phone: null,
      address1: "ERASED",
      address2: null,
      city: "ERASED",
      county: null,
      postcode: "ERASED",
    }).where(eq(ordersTable.customerId, customerId));

    await Promise.all([
      db.delete(wishlistsTable).where(eq(wishlistsTable.customerId, customerId)),
      db.delete(loyaltyTransactionsTable).where(eq(loyaltyTransactionsTable.customerId, customerId)),
      db.delete(stockAlertsTable).where(eq(stockAlertsTable.customerId, customerId)),
      db.delete(subscriptionsTable).where(eq(subscriptionsTable.customerId, customerId)),
    ]);

    await db.delete(customersTable).where(eq(customersTable.id, customerId));

    res.json({
      erased: true,
      customerId,
      originalEmail: customer.email,
      message: "Customer personal data erased and orders anonymised",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to erase customer GDPR data");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
