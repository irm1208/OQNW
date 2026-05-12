import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import {
  ordersTable,
  orderItemsTable,
  customersTable,
  discountCodesTable,
  productsInventoryTable,
  abandonedCartsTable,
} from "@workspace/db";
import { eq, sql, inArray, and } from "drizzle-orm";
import { sendOrderConfirmation, sendLowStockAlert, sendReferralReward } from "../lib/email";

const router = Router();

const SESSION_SECRET =
  process.env.SESSION_SECRET ??
  process.env.ADMIN_PASSWORD ??
  "omniqure-cust-session-fallback-secret";

function verifyCustomerSession(token: string): number | null {
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

function generateOrderNumber(): string {
  return `OQ-${Math.floor(100000 + Math.random() * 900000)}`;
}

interface CartItem {
  productId: number;
  productName: string;
  productCategory: string;
  quantity: number;
  priceGbp: number;
}

interface DeliveryDetails {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
}

router.post("/orders", async (req: Request, res: Response): Promise<void> => {
  const {
    delivery,
    shippingMethod,
    shippingCostGbp,
    items,
    discountCode,
  } = req.body as {
    delivery: unknown;
    shippingMethod: unknown;
    shippingCostGbp: unknown;
    items: unknown;
    discountCode?: unknown;
  };

  // Basic validation
  const d = delivery as DeliveryDetails;
  if (
    !d ||
    typeof d.email !== "string" ||
    !d.email.includes("@") ||
    typeof d.firstName !== "string" || !d.firstName.trim() ||
    typeof d.lastName !== "string" || !d.lastName.trim() ||
    typeof d.address1 !== "string" || !d.address1.trim() ||
    typeof d.city !== "string" || !d.city.trim() ||
    typeof d.postcode !== "string" || !d.postcode.trim() ||
    typeof d.country !== "string" || !d.country.trim()
  ) {
    res.status(400).json({ error: "Missing or invalid delivery details" });
    return;
  }

  if (typeof shippingMethod !== "string" || !shippingMethod.trim()) {
    res.status(400).json({ error: "Shipping method is required" });
    return;
  }

  if (typeof shippingCostGbp !== "number" || shippingCostGbp < 0) {
    res.status(400).json({ error: "Invalid shipping cost" });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Order must contain at least one item" });
    return;
  }

  const cartItems = items as CartItem[];
  for (const item of cartItems) {
    if (
      typeof item.productName !== "string" || !item.productName.trim() ||
      typeof item.productCategory !== "string" ||
      typeof item.quantity !== "number" || item.quantity < 1 ||
      typeof item.priceGbp !== "number" || item.priceGbp < 0
    ) {
      res.status(400).json({ error: "Invalid item data" });
      return;
    }
  }

  try {
    // Stock validation: ensure all items with a productId have sufficient stock
    const itemsWithProductId = cartItems.filter((item) => item.productId > 0);
    if (itemsWithProductId.length > 0) {
      const stockErrors: { productName: string; available: number; requested: number }[] = [];
      for (const item of itemsWithProductId) {
        const [inv] = await db
          .select({ stockLevel: productsInventoryTable.stockLevel })
          .from(productsInventoryTable)
          .where(eq(productsInventoryTable.productId, item.productId))
          .limit(1);
        if (inv !== undefined && inv.stockLevel < item.quantity) {
          stockErrors.push({
            productName: item.productName,
            available: inv.stockLevel,
            requested: item.quantity,
          });
        }
      }
      if (stockErrors.length > 0) {
        res.status(422).json({
          error: "Some items in your cart have insufficient stock",
          stockErrors,
        });
        return;
      }
    }

    // Validate discount code if provided
    let discountAmount = 0;
    let validatedDiscountCode: string | null = null;

    if (discountCode && typeof discountCode === "string" && discountCode.trim()) {
      const [discount] = await db
        .select()
        .from(discountCodesTable)
        .where(eq(discountCodesTable.code, discountCode.trim().toUpperCase()))
        .limit(1);

      if (
        discount &&
        discount.isActive &&
        !(discount.expiresAt && discount.expiresAt < new Date()) &&
        !(discount.usageLimit !== null && discount.usageCount >= discount.usageLimit)
      ) {
        const subtotal = cartItems.reduce((s, i) => s + i.priceGbp * i.quantity, 0);
        const minSpend = discount.minSpend ? parseFloat(String(discount.minSpend)) : null;
        if (minSpend === null || subtotal >= minSpend) {
          const value = parseFloat(String(discount.value));
          if (discount.type === "percentage") {
            discountAmount = Math.round((subtotal * value) / 100 * 100) / 100;
          } else {
            discountAmount = Math.min(value, subtotal);
          }
          validatedDiscountCode = discount.code;
        }
      }
    }

    const subtotalGbp = cartItems.reduce((s, i) => s + i.priceGbp * i.quantity, 0);
    const totalGbp = Math.max(0, subtotalGbp + shippingCostGbp - discountAmount);

    // Generate unique order number (retry once on collision)
    let orderNumber = generateOrderNumber();
    const existing = await db
      .select({ orderNumber: ordersTable.orderNumber })
      .from(ordersTable)
      .where(eq(ordersTable.orderNumber, orderNumber))
      .limit(1);
    if (existing.length > 0) {
      orderNumber = generateOrderNumber();
    }

    const customerName = `${d.firstName.trim()} ${d.lastName.trim()}`;

    // If a valid customer session cookie is present, use that customer ID directly.
    // This ensures orders are always linked to the authenticated account regardless
    // of what email the customer typed in the delivery form.
    const sessionToken = req.cookies?.customer_session as string | undefined;
    const sessionCustomerId = sessionToken ? verifyCustomerSession(sessionToken) : null;

    let customerId: number | null = null;

    if (sessionCustomerId) {
      // Authenticated checkout: update the authenticated customer's record
      const [sessionCustomer] = await db
        .select()
        .from(customersTable)
        .where(eq(customersTable.id, sessionCustomerId))
        .limit(1);

      if (sessionCustomer) {
        customerId = sessionCustomer.id;
        await db
          .update(customersTable)
          .set({
            totalOrders: sessionCustomer.totalOrders + 1,
            totalSpendGbp: String(
              (parseFloat(String(sessionCustomer.totalSpendGbp)) + totalGbp).toFixed(2)
            ),
            phone: d.phone ?? sessionCustomer.phone,
            address1: d.address1,
            address2: d.address2 ?? sessionCustomer.address2,
            city: d.city,
            county: d.county ?? sessionCustomer.county,
            postcode: d.postcode,
            country: d.country,
          })
          .where(eq(customersTable.id, sessionCustomer.id));
      }
    }

    if (!customerId) {
      // Guest checkout (or session didn't resolve): upsert by email
      const [existingCustomer] = await db
        .select()
        .from(customersTable)
        .where(eq(customersTable.email, d.email.toLowerCase()))
        .limit(1);

      if (existingCustomer) {
        customerId = existingCustomer.id;
        await db
          .update(customersTable)
          .set({
            totalOrders: existingCustomer.totalOrders + 1,
            totalSpendGbp: String(
              (parseFloat(String(existingCustomer.totalSpendGbp)) + totalGbp).toFixed(2)
            ),
            phone: d.phone ?? existingCustomer.phone,
            address1: d.address1,
            address2: d.address2 ?? existingCustomer.address2,
            city: d.city,
            county: d.county ?? existingCustomer.county,
            postcode: d.postcode,
            country: d.country,
          })
          .where(eq(customersTable.id, existingCustomer.id));
      } else {
        const [newCustomer] = await db
          .insert(customersTable)
          .values({
            email: d.email.toLowerCase(),
            firstName: d.firstName.trim(),
            lastName: d.lastName.trim(),
            phone: d.phone ?? null,
            address1: d.address1,
            address2: d.address2 ?? null,
            city: d.city,
            county: d.county ?? null,
            postcode: d.postcode,
            country: d.country,
            totalOrders: 1,
            totalSpendGbp: String(totalGbp.toFixed(2)),
          })
          .returning();
        customerId = newCustomer.id;
      }
    }

    // Insert order
    const [order] = await db
      .insert(ordersTable)
      .values({
        orderNumber,
        status: "pending",
        customerEmail: d.email.toLowerCase(),
        customerName,
        customerId,
        phone: d.phone ?? null,
        address1: d.address1,
        address2: d.address2 ?? null,
        city: d.city,
        county: d.county ?? null,
        postcode: d.postcode,
        country: d.country,
        subtotalGbp: String(subtotalGbp.toFixed(2)),
        shippingCostGbp: String(shippingCostGbp.toFixed(2)),
        totalGbp: String(totalGbp.toFixed(2)),
        shippingMethod,
        notes: validatedDiscountCode ? `Discount: ${validatedDiscountCode} (-£${discountAmount.toFixed(2)})` : null,
      })
      .returning();

    // Insert order items
    await db.insert(orderItemsTable).values(
      cartItems.map(item => ({
        orderId: order.id,
        productId: item.productId || 0,
        productName: item.productName,
        productCategory: item.productCategory,
        quantity: item.quantity,
        priceGbp: String(item.priceGbp.toFixed(2)),
      }))
    );

    // Increment discount code usage
    if (validatedDiscountCode) {
      await db
        .update(discountCodesTable)
        .set({ usageCount: sql`${discountCodesTable.usageCount} + 1` })
        .where(eq(discountCodesTable.code, validatedDiscountCode));
    }

    // Decrement stock for each item (clamp to 0)
    const decrementedProductIds: number[] = [];
    for (const item of cartItems) {
      if (item.productId) {
        await db
          .update(productsInventoryTable)
          .set({ stockLevel: sql`GREATEST(${productsInventoryTable.stockLevel} - ${item.quantity}, 0)` })
          .where(eq(productsInventoryTable.productId, item.productId));
        decrementedProductIds.push(item.productId);
      }
    }

    // Fire low-stock alert for any products now at or below their threshold
    if (decrementedProductIds.length > 0) {
      db.select()
        .from(productsInventoryTable)
        .where(inArray(productsInventoryTable.productId, decrementedProductIds))
        .then((rows) => {
          const lowStock = rows.filter((r) => r.stockLevel <= r.lowStockThreshold);
          if (lowStock.length > 0) {
            sendLowStockAlert(
              lowStock.map((r) => ({
                productName: r.productName,
                stockLevel: r.stockLevel,
                lowStockThreshold: r.lowStockThreshold,
              }))
            ).catch(() => {});
          }
        })
        .catch(() => {});
    }

    // Mark abandoned cart as converted (non-blocking)
    if (customerId) {
      db.update(abandonedCartsTable)
        .set({ convertedAt: new Date() })
        .where(eq(abandonedCartsTable.customerId, customerId))
        .catch(() => {});
    }

    // Referral reward: if this is the referred customer's first order, reward the referrer
    if (customerId) {
      (async () => {
        try {
          const [cust] = await db
            .select({ totalOrders: customersTable.totalOrders, referredBy: customersTable.referredBy })
            .from(customersTable)
            .where(eq(customersTable.id, customerId!))
            .limit(1);
          if (cust?.totalOrders === 1 && cust.referredBy) {
            const [referrer] = await db
              .select({ id: customersTable.id, email: customersTable.email, firstName: customersTable.firstName, lastName: customersTable.lastName })
              .from(customersTable)
              .where(eq(customersTable.referralCode, cust.referredBy))
              .limit(1);
            if (referrer) {
              const creditCode = `REWARD-${Math.random().toString(36).toUpperCase().slice(2, 10)}`;
              await db.insert(discountCodesTable).values({
                code: creditCode,
                type: "fixed",
                value: "10.00",
                isActive: true,
                usageLimit: 1,
                usageCount: 0,
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
              });
              await sendReferralReward({
                referrerName: `${referrer.firstName} ${referrer.lastName}`,
                referrerEmail: referrer.email,
                refereeName: customerName,
                discountCode: creditCode,
                creditGbp: 10,
              });
            }
          }
        } catch {}
      })();
    }

    // Send confirmation email (non-blocking — errors are logged but won't fail the response)
    sendOrderConfirmation({
      orderNumber,
      customerName,
      customerEmail: d.email.toLowerCase(),
      items: cartItems.map(i => ({
        productName: i.productName,
        productCategory: i.productCategory,
        quantity: i.quantity,
        priceGbp: i.priceGbp,
      })),
      subtotalGbp,
      shippingCostGbp,
      totalGbp,
      shippingMethod,
      trackingNumber: null,
      address1: d.address1,
      address2: d.address2 ?? null,
      city: d.city,
      postcode: d.postcode,
      country: d.country,
    }).catch(() => {});

    res.status(201).json({
      orderNumber,
      customerName,
      totalGbp,
      shippingMethod,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/orders/track?number=OQ-XXXXXX — public order tracking (limited data)
router.get("/orders/track", async (req: Request, res: Response): Promise<void> => {
  const orderNumber = typeof req.query.number === "string" ? req.query.number.trim().toUpperCase() : null;
  if (!orderNumber) {
    res.status(400).json({ error: "Order number is required" });
    return;
  }
  try {
    const [order] = await db
      .select({
        id: ordersTable.id,
        orderNumber: ordersTable.orderNumber,
        status: ordersTable.status,
        shippingMethod: ordersTable.shippingMethod,
        createdAt: ordersTable.createdAt,
      })
      .from(ordersTable)
      .where(eq(ordersTable.orderNumber, orderNumber))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const items = await db
      .select({
        productName: orderItemsTable.productName,
        quantity: orderItemsTable.quantity,
      })
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, order.id));

    res.status(200).json({
      orderNumber: order.orderNumber,
      status: order.status,
      shippingMethod: order.shippingMethod,
      createdAt: order.createdAt.toISOString(),
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
      items,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to track order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
