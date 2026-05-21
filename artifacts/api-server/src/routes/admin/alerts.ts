import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import {
  ordersTable,
  returnsTable,
  productsInventoryTable,
  abandonedCartsTable,
} from "@workspace/db/schema";
import { eq, lte, isNull, gt, gte, and, desc } from "drizzle-orm";

const router = Router();

export type AlertSeverity = "info" | "warning" | "danger";
export type AlertType = "order" | "return" | "stock" | "cart" | "fraud";

export interface AdminAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  link: string;
  createdAt: string;
}

router.get("/admin/alerts", async (req: Request, res: Response): Promise<void> => {
  try {
    const alerts: AdminAlert[] = [];

    const [pendingOrders, pendingReturns, lowStockItems, abandonedCarts, fraudOrders] =
      await Promise.all([
        db
          .select({
            id: ordersTable.id,
            orderNumber: ordersTable.orderNumber,
            customerName: ordersTable.customerName,
            totalGbp: ordersTable.totalGbp,
            createdAt: ordersTable.createdAt,
          })
          .from(ordersTable)
          .where(eq(ordersTable.status, "pending"))
          .orderBy(ordersTable.createdAt),

        db
          .select({
            id: returnsTable.id,
            orderNumber: returnsTable.orderNumber,
            customerName: returnsTable.customerName,
            reason: returnsTable.reason,
            createdAt: returnsTable.createdAt,
          })
          .from(returnsTable)
          .where(eq(returnsTable.status, "requested"))
          .orderBy(returnsTable.createdAt),

        db
          .select({
            id: productsInventoryTable.id,
            productName: productsInventoryTable.productName,
            stockLevel: productsInventoryTable.stockLevel,
            lowStockThreshold: productsInventoryTable.lowStockThreshold,
            updatedAt: productsInventoryTable.updatedAt,
          })
          .from(productsInventoryTable)
          .where(lte(productsInventoryTable.stockLevel, productsInventoryTable.lowStockThreshold)),

        db
          .select({
            id: abandonedCartsTable.id,
            customerName: abandonedCartsTable.customerName,
            customerEmail: abandonedCartsTable.customerEmail,
            updatedAt: abandonedCartsTable.updatedAt,
          })
          .from(abandonedCartsTable)
          .where(isNull(abandonedCartsTable.convertedAt))
          .orderBy(abandonedCartsTable.updatedAt),

        db
          .select({
            id: ordersTable.id,
            orderNumber: ordersTable.orderNumber,
            customerName: ordersTable.customerName,
            fraudScore: ordersTable.fraudScore,
            createdAt: ordersTable.createdAt,
          })
          .from(ordersTable)
          .where(
            and(
              gte(ordersTable.fraudScore, 40),
              eq(ordersTable.fraudReviewed, false),
            ),
          )
          .orderBy(desc(ordersTable.fraudScore), desc(ordersTable.createdAt))
          .limit(5),
      ]);

    for (const order of pendingOrders) {
      alerts.push({
        id: `order-${order.id}`,
        type: "order",
        severity: "warning",
        title: "Pending Order",
        message: `${order.customerName} — £${parseFloat(String(order.totalGbp ?? "0")).toFixed(2)} (${order.orderNumber})`,
        link: `/orders/${order.id}`,
        createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
      });
    }

    for (const ret of pendingReturns) {
      alerts.push({
        id: `return-${ret.id}`,
        type: "return",
        severity: "warning",
        title: "Return Request",
        message: `${ret.customerName} — Order ${ret.orderNumber}`,
        link: `/returns`,
        createdAt: ret.createdAt?.toISOString() ?? new Date().toISOString(),
      });
    }

    for (const item of lowStockItems) {
      const level = item.stockLevel ?? 0;
      alerts.push({
        id: `stock-${item.id}`,
        type: "stock",
        severity: level === 0 ? "danger" : "warning",
        title: level === 0 ? "Out of Stock" : "Low Stock",
        message: `${item.productName} — ${level} unit${level !== 1 ? "s" : ""} remaining`,
        link: `/stock-alerts`,
        createdAt: item.updatedAt?.toISOString() ?? new Date().toISOString(),
      });
    }

    for (const cart of abandonedCarts) {
      alerts.push({
        id: `cart-${cart.id}`,
        type: "cart",
        severity: "info",
        title: "Abandoned Cart",
        message: `${cart.customerName} (${cart.customerEmail})`,
        link: `/abandoned-carts`,
        createdAt: cart.updatedAt?.toISOString() ?? new Date().toISOString(),
      });
    }

    for (const fo of fraudOrders) {
      const score = fo.fraudScore ?? 0;
      alerts.push({
        id: `fraud-${fo.id}`,
        type: "fraud",
        severity: score >= 60 ? "danger" : "warning",
        title: score >= 60 ? "High Risk Order" : "Suspicious Order",
        message: `${fo.customerName} — Score ${score} (${fo.orderNumber})`,
        link: `/fraud`,
        createdAt: fo.createdAt?.toISOString() ?? new Date().toISOString(),
      });
    }

    alerts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.json(alerts);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch admin alerts");
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

export default router;
