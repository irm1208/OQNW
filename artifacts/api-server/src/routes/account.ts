import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { customersTable, ordersTable, orderItemsTable } from "@workspace/db";
import { eq, desc, inArray } from "drizzle-orm";

const router = Router();

const SESSION_SECRET =
  process.env.SESSION_SECRET ??
  process.env.ADMIN_PASSWORD ??
  "omniqure-cust-session-fallback-secret";
const COOKIE_NAME = "customer_session";

function verifyToken(token: string): number | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  if (sig !== expected) return null;
  const id = parseInt(payload, 10);
  return isNaN(id) ? null : id;
}

function requireCustomer(req: Request, res: Response): number | null {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  const id = verifyToken(token);
  if (!id) {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.status(401).json({ error: "Invalid session" });
    return null;
  }
  return id;
}

// GET /account/me — full customer profile
router.get("/account/me", async (req: Request, res: Response): Promise<void> => {
  const customerId = requireCustomer(req, res);
  if (!customerId) return;

  try {
    const [customer] = await db
      .select({
        id: customersTable.id,
        email: customersTable.email,
        firstName: customersTable.firstName,
        lastName: customersTable.lastName,
        totalOrders: customersTable.totalOrders,
        totalSpendGbp: customersTable.totalSpendGbp,
        createdAt: customersTable.createdAt,
      })
      .from(customersTable)
      .where(eq(customersTable.id, customerId))
      .limit(1);

    if (!customer) {
      res.clearCookie(COOKIE_NAME, { path: "/" });
      res.status(401).json({ error: "Customer not found" });
      return;
    }

    res.status(200).json({
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      totalOrders: customer.totalOrders,
      totalSpendGbp: parseFloat(String(customer.totalSpendGbp)),
      memberSince: customer.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get account profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /account/orders — customer's order history with items
router.get("/account/orders", async (req: Request, res: Response): Promise<void> => {
  const customerId = requireCustomer(req, res);
  if (!customerId) return;

  try {
    const orders = await db
      .select({
        id: ordersTable.id,
        orderNumber: ordersTable.orderNumber,
        status: ordersTable.status,
        totalGbp: ordersTable.totalGbp,
        shippingMethod: ordersTable.shippingMethod,
        trackingNumber: ordersTable.trackingNumber,
        createdAt: ordersTable.createdAt,
      })
      .from(ordersTable)
      .where(eq(ordersTable.customerId, customerId))
      .orderBy(desc(ordersTable.createdAt))
      .limit(50);

    if (orders.length === 0) {
      res.status(200).json([]);
      return;
    }

    const orderIds = orders.map((o) => o.id);
    const allItems = await db
      .select({
        orderId: orderItemsTable.orderId,
        productName: orderItemsTable.productName,
        productCategory: orderItemsTable.productCategory,
        quantity: orderItemsTable.quantity,
        priceGbp: orderItemsTable.priceGbp,
      })
      .from(orderItemsTable)
      .where(inArray(orderItemsTable.orderId, orderIds));

    const itemsByOrderId: Record<number, typeof allItems> = {};
    for (const item of allItems) {
      if (!itemsByOrderId[item.orderId]) itemsByOrderId[item.orderId] = [];
      itemsByOrderId[item.orderId].push(item);
    }

    res.status(200).json(
      orders.map((o) => ({
        orderNumber: o.orderNumber,
        status: o.status,
        totalGbp: parseFloat(String(o.totalGbp)),
        shippingMethod: o.shippingMethod ?? null,
        trackingNumber: o.trackingNumber ?? null,
        createdAt: o.createdAt.toISOString(),
        items: (itemsByOrderId[o.id] ?? []).map((i) => ({
          productName: i.productName,
          productCategory: i.productCategory,
          quantity: i.quantity,
          priceGbp: parseFloat(String(i.priceGbp)),
        })),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get account orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /account/profile — update name
router.patch("/account/profile", async (req: Request, res: Response): Promise<void> => {
  const customerId = requireCustomer(req, res);
  if (!customerId) return;

  const { firstName, lastName } = req.body as { firstName?: unknown; lastName?: unknown };

  if (
    typeof firstName !== "string" || !firstName.trim() ||
    typeof lastName !== "string" || !lastName.trim()
  ) {
    res.status(400).json({ error: "First name and last name are required" });
    return;
  }

  try {
    await db
      .update(customersTable)
      .set({ firstName: firstName.trim(), lastName: lastName.trim() })
      .where(eq(customersTable.id, customerId));

    res.status(200).json({ ok: true, firstName: firstName.trim(), lastName: lastName.trim() });
  } catch (err) {
    req.log.error({ err }, "Failed to update profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /account/password — change password
router.post("/account/password", async (req: Request, res: Response): Promise<void> => {
  const customerId = requireCustomer(req, res);
  if (!customerId) return;

  const { currentPassword, newPassword } = req.body as {
    currentPassword?: unknown;
    newPassword?: unknown;
  };

  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    newPassword.length < 8
  ) {
    res.status(400).json({ error: "New password must be at least 8 characters" });
    return;
  }

  try {
    const [customer] = await db
      .select({ passwordHash: customersTable.passwordHash })
      .from(customersTable)
      .where(eq(customersTable.id, customerId))
      .limit(1);

    if (!customer || !customer.passwordHash) {
      res.status(400).json({ error: "No password set on this account" });
      return;
    }

    const match = await bcrypt.compare(currentPassword, customer.passwordHash);
    if (!match) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db
      .update(customersTable)
      .set({ passwordHash: newHash })
      .where(eq(customersTable.id, customerId));

    res.status(200).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to change password");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
