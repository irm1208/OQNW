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
  productsCatalogTable,
  abandonedCartsTable,
  loyaltyTransactionsTable,
  inventoryAuditLogTable,
} from "@workspace/db";
import { eq, sql, inArray, and, gte, count } from "drizzle-orm";
import {
  sendOrderConfirmation,
  sendBankTransferInstructions,
  sendBitcoinInstructions,
  sendLowStockAlert,
  sendReferralReward,
  sendWelcomeEmail,
  generateReceiptHtml,
  type OrderEmailData,
} from "../lib/email";
import { createBtcPayInvoice, isBtcPayConfigured } from "../lib/btcpay";
import { createWallidPayment, isWallidConfigured, type WallidItem } from "../lib/wallid";
import { assessFraud } from "../lib/fraudScorer";
import { getClientIp, lookupIpData } from "../lib/geoip";
import { dispatchWebhook } from "../lib/webhookDispatcher";

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  "United States": "US", "United Kingdom": "GB", "Canada": "CA",
  "Australia": "AU", "Germany": "DE", "France": "FR", "Netherlands": "NL",
  "Spain": "ES", "Italy": "IT", "Sweden": "SE", "Norway": "NO",
  "Denmark": "DK", "Finland": "FI", "Belgium": "BE", "Switzerland": "CH",
  "Austria": "AT", "Portugal": "PT", "Ireland": "IE", "New Zealand": "NZ",
  "Japan": "JP", "Singapore": "SG", "Hong Kong": "HK", "South Korea": "KR",
  "Taiwan": "TW", "Malaysia": "MY", "Thailand": "TH", "United Arab Emirates": "AE",
  "Luxembourg": "LU", "Iceland": "IS", "Bulgaria": "BG", "Croatia": "HR",
  "Cyprus": "CY", "Czech Republic": "CZ", "Estonia": "EE", "Greece": "GR",
  "Hungary": "HU", "Latvia": "LV", "Lithuania": "LT", "Malta": "MT",
  "Poland": "PL", "Romania": "RO", "Slovakia": "SK", "Slovenia": "SI",
};

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
  productSlug?: string; // preferred lookup key — more reliable than the frontend's integer id
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
    loyaltyPointsRedeemed,
    paymentMethod,
    cryptoCurrency,
    redeemFreePeptide,
  } = req.body as {
    delivery: unknown;
    shippingMethod: unknown;
    shippingCostGbp: unknown;
    items: unknown;
    discountCode?: unknown;
    loyaltyPointsRedeemed?: unknown;
    paymentMethod?: unknown;
    cryptoCurrency?: unknown;
    redeemFreePeptide?: unknown;
  };
  const cryptoCurrencyStr = typeof cryptoCurrency === "string" ? cryptoCurrency.toUpperCase() : "BTC";

  const paymentMethodStr = typeof paymentMethod === "string" ? paymentMethod : "wallid";

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
    // ── Catalog lookup by slug ──────────────────────────────────────────────────
    // The frontend assigns its own sequential IDs which do NOT match the DB serial
    // IDs.  Slug is the reliable cross-reference — look up everything by slug.
    // Items without a slug (e.g. client-side Bac Water add-ons) are skipped for
    // price/stock validation but still included in the order.
    const itemsWithSlug = cartItems.filter(i => i.productSlug?.trim());
    const catalogBySlug = new Map<string, { id: number; priceGbp: string | null; category: string }>();

    if (itemsWithSlug.length > 0) {
      const slugRows = await db
        .select({
          id: productsCatalogTable.id,
          slug: productsCatalogTable.slug,
          priceGbp: productsCatalogTable.priceGbp,
          category: productsCatalogTable.category,
        })
        .from(productsCatalogTable)
        .where(inArray(productsCatalogTable.slug, itemsWithSlug.map(i => i.productSlug!)));
      for (const r of slugRows) catalogBySlug.set(r.slug, r);
    }

    // Resolved DB product ID for a cart item (0 when slug not found or missing).
    function dbProductId(item: CartItem): number {
      return (item.productSlug?.trim() ? catalogBySlug.get(item.productSlug)?.id : undefined) ?? 0;
    }

    // Stock validation using resolved DB IDs
    const stockErrors: { productName: string; available: number; requested: number }[] = [];
    for (const item of cartItems) {
      const dbId = dbProductId(item);
      if (dbId <= 0) continue;
      const [inv] = await db
        .select({ stockLevel: productsInventoryTable.stockLevel })
        .from(productsInventoryTable)
        .where(eq(productsInventoryTable.productId, dbId))
        .limit(1);
      if (inv !== undefined && inv.stockLevel < item.quantity) {
        stockErrors.push({ productName: item.productName, available: inv.stockLevel, requested: item.quantity });
      }
    }
    if (stockErrors.length > 0) {
      res.status(422).json({ error: "Some items in your cart have insufficient stock", stockErrors });
      return;
    }

    // Price validation: verify submitted priceGbp against the catalog price.
    // Items with a slug MUST resolve to a known catalog entry — an unrecognised
    // slug is rejected outright so callers cannot spoof catalog products by sending
    // an unknown slug to skip validation.  Items with no slug at all are treated
    // as unverified add-ons (e.g. Bac Water) and are exempt from price checks.
    // Category is taken from catalog here for Bundle & Save below.
    for (const item of itemsWithSlug) {
      const catalogEntry = catalogBySlug.get(item.productSlug!);
      if (!catalogEntry) {
        req.log.warn({ slug: item.productSlug, productName: item.productName }, "Order rejected: unrecognised product slug");
        res.status(400).json({ error: "Unrecognised product — please refresh your cart and try again" });
        return;
      }
      if (catalogEntry.priceGbp != null) {
        const catalogPrice = parseFloat(String(catalogEntry.priceGbp));
        if (Math.abs(item.priceGbp - catalogPrice) > 0.01) {
          res.status(400).json({ error: "Item price mismatch — please refresh your cart and try again" });
          return;
        }
      }
    }

    // For Bundle & Save, an item qualifies as a "peptide" only when its slug
    // resolves to a catalog entry whose category isn't Accessories.
    function isCatalogPeptide(item: CartItem): boolean {
      if (!item.productSlug?.trim()) return false;
      const entry = catalogBySlug.get(item.productSlug);
      return entry !== undefined && entry.category !== "Accessories";
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

    // Validate loyalty points redemption
    const loyaltySessionCustomerId = (() => {
      const t = req.cookies?.customer_session as string | undefined;
      return t ? verifyCustomerSession(t) : null;
    })();
    let loyaltyDiscountGbp = 0;
    let loyaltyPointsToDeduct = 0;
    if (
      loyaltyPointsRedeemed &&
      typeof loyaltyPointsRedeemed === "number" &&
      loyaltyPointsRedeemed >= 100 &&
      loyaltySessionCustomerId
    ) {
      const validPoints = Math.floor(loyaltyPointsRedeemed / 100) * 100;
      const txRows = await db
        .select({ pts: loyaltyTransactionsTable.points })
        .from(loyaltyTransactionsTable)
        .where(eq(loyaltyTransactionsTable.customerId, loyaltySessionCustomerId));
      const currentBalance = txRows.reduce((s, r) => s + r.pts, 0);
      if (currentBalance >= validPoints) {
        loyaltyPointsToDeduct = validPoints;
        loyaltyDiscountGbp = validPoints / 100;
      }
    }

    // Validate referral credit redemption
    // Referral credit is a flat £ balance (earned £25 at a time by both referrer and
    // referee, capped at £50 unredeemed). Redeeming applies up to the full order
    // subtotal — it isn't tied to any single item's price.
    const REFERRAL_CREDIT_CAP_GBP = 50;
    let freePeptideDeductGbp = 0;
    let freePeptideCreditUsed = false;
    let referralCreditRedeemedGbp = 0;
    if (redeemFreePeptide === true && loyaltySessionCustomerId) {
      const [custCredit] = await db
        .select({ referralCreditGbp: customersTable.referralCreditGbp })
        .from(customersTable)
        .where(eq(customersTable.id, loyaltySessionCustomerId))
        .limit(1);
      const availableCreditGbp = Number(custCredit?.referralCreditGbp ?? 0);
      if (availableCreditGbp > 0) {
        const orderSubtotalGbp = (cartItems as CartItem[]).reduce((s, i) => s + i.priceGbp * i.quantity, 0);
        referralCreditRedeemedGbp = Math.min(availableCreditGbp, orderSubtotalGbp);
        freePeptideDeductGbp = referralCreditRedeemedGbp;
        freePeptideCreditUsed = referralCreditRedeemedGbp > 0;
      }
    }

    // ── Bundle & Save — server-side free-item tier calculation ────────────────
    // Tiers (peptide-item quantity, accessories like Bac Water excluded) — mutually
    // exclusive, not cumulative:
    //   3-4  -> a free 10ml bacteriostatic water (FREE_BAC_WATER_VALUE_GBP)
    //   5-9  -> the cheapest peptide unit in the cart is free (no free BAC water)
    //   10+  -> the 2 cheapest peptide units in the cart are free (no free BAC water)
    // This applies unconditionally, including to a referred customer's first order —
    // there is no longer a percentage-discount stacking conflict with the referral reward.
    const FREE_BAC_WATER_VALUE_GBP = 8.99;
    const peptideUnits: { productId: number; price: number }[] = [];
    let peptideQty = 0;
    for (const item of cartItems as CartItem[]) {
      if (!isCatalogPeptide(item)) continue;
      peptideQty += item.quantity;
      for (let i = 0; i < item.quantity; i++) peptideUnits.push({ productId: dbProductId(item), price: item.priceGbp });
    }
    const bundleFreeItemsCount = peptideQty >= 10 ? 2 : peptideQty >= 5 ? 1 : 0;
    const bundleFreeBacWater = peptideQty >= 3 && peptideQty < 5;
    // The cheapest N peptide units become free; track which specific product(s) they
    // came from so the persisted order items can split into paid/free line items —
    // mirrors the frontend's freeUnitsByProductId so cart, checkout, and order records agree.
    const cheapestFreeUnits = peptideUnits
      .map((u, idx) => ({ ...u, idx }))
      .sort((a, b) => a.price - b.price || a.idx - b.idx)
      .slice(0, bundleFreeItemsCount);
    const freeUnitsByProductId = new Map<number, number>();
    let freeItemsValue = 0;
    for (const u of cheapestFreeUnits) {
      freeUnitsByProductId.set(u.productId, (freeUnitsByProductId.get(u.productId) ?? 0) + 1);
      freeItemsValue += u.price;
    }
    const bundleDiscountGbp = Math.round(
      (freeItemsValue + (bundleFreeBacWater ? FREE_BAC_WATER_VALUE_GBP : 0)) * 100
    ) / 100;
    const bundleFreeLabel = bundleFreeItemsCount === 2
      ? "2 cheapest peptides free"
      : bundleFreeItemsCount === 1
      ? "cheapest peptide free"
      : bundleFreeBacWater
      ? "free BAC water"
      : "";

    const subtotalGbp = cartItems.reduce((s, i) => s + i.priceGbp * i.quantity, 0);
    const totalGbp = Math.max(0, subtotalGbp + shippingCostGbp - bundleDiscountGbp - discountAmount - loyaltyDiscountGbp - freePeptideDeductGbp);

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

    // Fraud scoring
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const [recentOrderResult] = await db
      .select({ cnt: count() })
      .from(ordersTable)
      .where(and(eq(ordersTable.customerEmail, d.email.toLowerCase()), gte(ordersTable.createdAt, oneHourAgo)));
    const recentOrdersLastHour = recentOrderResult?.cnt ?? 0;

    const [customerOrderResult] = customerId
      ? await db
          .select({ totalOrders: customersTable.totalOrders, createdAt: customersTable.createdAt })
          .from(customersTable)
          .where(eq(customersTable.id, customerId))
          .limit(1)
      : [{ totalOrders: 0, createdAt: null as Date | null }];
    const isFirstOrder = (customerOrderResult?.totalOrders ?? 0) <= 1;
    const isNewAccount = customerOrderResult?.createdAt
      ? Date.now() - new Date(customerOrderResult.createdAt).getTime() < 10 * 60 * 1000
      : false;

    const clientIp = getClientIp(req);
    const ipData = clientIp
      ? await lookupIpData(clientIp).catch(() => ({ countryCode: null, isProxy: false }))
      : { countryCode: null, isProxy: false };
    const shippingCountryCode = COUNTRY_NAME_TO_CODE[d.country] ?? null;

    const { score: fraudScore, flags: fraudFlags } = assessFraud({
      email: d.email,
      totalGbp,
      country: d.country,
      address1: d.address1,
      isFirstOrder,
      orderCount: customerOrderResult?.totalOrders ?? 0,
      recentOrdersLastHour: Number(recentOrdersLastHour),
      paymentMethod: paymentMethodStr,
      isNewAccount,
      ipCountry: ipData.countryCode,
      shippingCountryCode,
      isProxy: ipData.isProxy,
    });

    // Insert order
    const [order] = await db
      .insert(ordersTable)
      .values({
        orderNumber,
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
        bundleDiscountGbp: String(bundleDiscountGbp.toFixed(2)),
        shippingCostGbp: String(shippingCostGbp.toFixed(2)),
        totalGbp: String(totalGbp.toFixed(2)),
        shippingMethod,
        status: ["bitcoin", "wallid"].includes(paymentMethodStr) ? "awaiting_payment" : "pending" as const,
        notes: [
          `Payment method: ${paymentMethodStr}`,
          bundleDiscountGbp > 0 ? `Bundle & Save: ${bundleFreeLabel} (-£${bundleDiscountGbp.toFixed(2)})` : null,
          validatedDiscountCode ? `Discount: ${validatedDiscountCode} (-£${discountAmount.toFixed(2)})` : null,
          loyaltyPointsToDeduct > 0 ? `Loyalty: ${loyaltyPointsToDeduct} pts redeemed (-£${loyaltyDiscountGbp.toFixed(2)})` : null,
        ].filter(Boolean).join("; ") || null,
        fraudScore,
        fraudFlags,
      })
      .returning();

    // Insert order items — split a cart line into paid/free rows when some (but not all)
    // of its units were selected as the tier's cheapest-free units, so order records clearly
    // show which units were free, matching the cart/checkout "X free — Bundle & Save" display.
    const orderItemRows: {
      orderId: number;
      productId: number;
      productName: string;
      productCategory: string;
      quantity: number;
      priceGbp: string;
    }[] = [];
    for (const item of cartItems as CartItem[]) {
      const productId = dbProductId(item); // use resolved DB ID, not unreliable frontend ID
      const freeQty = isCatalogPeptide(item) ? Math.min(freeUnitsByProductId.get(productId) ?? 0, item.quantity) : 0;
      const paidQty = item.quantity - freeQty;
      if (paidQty > 0) {
        orderItemRows.push({
          orderId: order.id,
          productId,
          productName: item.productName,
          productCategory: item.productCategory,
          quantity: paidQty,
          priceGbp: String(item.priceGbp.toFixed(2)),
        });
      }
      if (freeQty > 0) {
        orderItemRows.push({
          orderId: order.id,
          productId,
          productName: `${item.productName} (Bundle & Save — free)`,
          productCategory: item.productCategory,
          quantity: freeQty,
          priceGbp: "0.00",
        });
      }
    }
    // The free 10ml BAC water (3+ peptide tier) is a server-computed freebie, not something
    // the client adds to its own cart — insert it as its own zero-priced order item.
    if (bundleFreeBacWater) {
      orderItemRows.push({
        orderId: order.id,
        productId: 0,
        productName: "Bacteriostatic Water 10ml (Bundle & Save — free)",
        productCategory: "Accessories",
        quantity: 1,
        priceGbp: "0.00",
      });
    }
    await db.insert(orderItemsTable).values(orderItemRows);

    // Track customer IP on every order (non-blocking)
    if (customerId && clientIp) {
      db.update(customersTable).set({
        lastSeenIp: clientIp,
        knownIps: sql`(SELECT array_agg(DISTINCT x) FROM unnest(array_append(COALESCE(known_ips, ARRAY[]::text[]), ${clientIp}::text)) AS x)`,
      }).where(eq(customersTable.id, customerId)).catch(() => {});
    }

    // Award and redeem loyalty points (non-blocking)
    const loyaltyCustomerId = customerId ?? sessionCustomerId;
    if (loyaltyCustomerId) {
      const earnedPoints = Math.floor(totalGbp);
      if (earnedPoints > 0) {
        db.insert(loyaltyTransactionsTable).values({
          customerId: loyaltyCustomerId,
          orderId: order.id,
          type: "earned",
          points: earnedPoints,
          description: `Points earned on order ${orderNumber}`,
        }).catch(() => {});
      }
      if (loyaltyPointsToDeduct > 0) {
        db.insert(loyaltyTransactionsTable).values({
          customerId: loyaltyCustomerId,
          orderId: order.id,
          type: "redeemed",
          points: -loyaltyPointsToDeduct,
          description: `${loyaltyPointsToDeduct} pts redeemed on order ${orderNumber} (−£${loyaltyDiscountGbp.toFixed(2)})`,
        }).catch(() => {});
      }
      if (freePeptideCreditUsed) {
        db.update(customersTable)
          .set({ referralCreditGbp: sql`GREATEST(referral_credit_gbp - ${referralCreditRedeemedGbp}, 0)` })
          .where(eq(customersTable.id, loyaltyCustomerId))
          .catch(() => {});
      }
    }

    // Increment discount code usage
    if (validatedDiscountCode) {
      await db
        .update(discountCodesTable)
        .set({ usageCount: sql`${discountCodesTable.usageCount} + 1` })
        .where(eq(discountCodesTable.code, validatedDiscountCode));
    }

    // Decrement stock for each item (clamp to 0) + write inventory audit log
    const decrementedProductIds: number[] = [];
    for (const item of cartItems) {
      const resolvedId = dbProductId(item);
      if (resolvedId > 0) {
        const [before] = await db
          .select({ stockLevel: productsInventoryTable.stockLevel })
          .from(productsInventoryTable)
          .where(eq(productsInventoryTable.productId, resolvedId))
          .limit(1);
        const qBefore = before?.stockLevel ?? 0;
        await db
          .update(productsInventoryTable)
          .set({ stockLevel: sql`GREATEST(${productsInventoryTable.stockLevel} - ${item.quantity}, 0)` })
          .where(eq(productsInventoryTable.productId, resolvedId));
        const qAfter = Math.max(0, qBefore - item.quantity);
        db.insert(inventoryAuditLogTable).values({
          productId: resolvedId,
          productName: item.productName,
          changeType: "sale",
          quantityBefore: qBefore,
          quantityAfter: qAfter,
          quantityChange: -(item.quantity),
          reason: `Sold via order ${orderNumber}`,
          referenceId: orderNumber,
          referenceType: "order",
        }).catch(() => {});
        decrementedProductIds.push(resolvedId);
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
          if (cust?.totalOrders === 1) {
            sendWelcomeEmail({ customerName, customerEmail: d.email.toLowerCase() }).catch(() => {});
          }
          if (cust?.totalOrders === 1 && cust.referredBy) {
            const [referrer] = await db
              .select({
                id: customersTable.id,
                email: customersTable.email,
                firstName: customersTable.firstName,
                lastName: customersTable.lastName,
                postcode: customersTable.postcode,
                address1: customersTable.address1,
                lastSeenIp: customersTable.lastSeenIp,
                knownIps: customersTable.knownIps,
                referralCreditGbp: customersTable.referralCreditGbp,
              })
              .from(customersTable)
              .where(eq(customersTable.referralCode, cust.referredBy))
              .limit(1);
            if (referrer) {
              // Abuse checks — block reward if any of the following are true:
              // 1. New customer is using a VPN / proxy / hosting IP (can mask identity)
              // 2. New customer's IP matches any IP ever seen on the referrer's account
              // 3. New customer's IP matches any IP ever seen on any other existing customer
              // 4. Referred customer's billing postcode matches the referrer's postcode
              // 5. Referred customer's last name matches the referrer's last name AND first 3 chars of first name match
              // 6. Referrer already has the max £50 unredeemed referral credit balance
              let abuseDetected = false;
              let abuseReason = "";

              if (ipData.isProxy) {
                abuseDetected = true;
                abuseReason = "VPN/proxy IP detected on referred customer";
              }

              if (!abuseDetected && clientIp) {
                const referrerKnownIps: string[] = referrer.knownIps ?? (referrer.lastSeenIp ? [referrer.lastSeenIp] : []);
                if (referrerKnownIps.includes(clientIp)) {
                  abuseDetected = true;
                  abuseReason = "Referred customer IP matches referrer's known IPs";
                }
              }

              if (!abuseDetected && clientIp) {
                const [anyIpConflict] = await db
                  .select({ id: customersTable.id })
                  .from(customersTable)
                  .where(
                    and(
                      sql`${clientIp} = ANY(COALESCE(${customersTable.knownIps}, ARRAY[]::text[]))`,
                      sql`${customersTable.id} != ${customerId}`
                    )
                  )
                  .limit(1);
                if (anyIpConflict) {
                  abuseDetected = true;
                  abuseReason = "Referred customer IP already seen on another account";
                }
              }

              if (!abuseDetected && referrer.postcode && d.postcode) {
                // Same billing postcode — strong signal of same person / household self-referral
                const normalize = (s: string) => s.trim().toUpperCase().replace(/\s+/g, "");
                if (normalize(referrer.postcode) === normalize(d.postcode)) {
                  abuseDetected = true;
                  abuseReason = "Referred customer billing postcode matches referrer's postcode";
                }
              }

              if (!abuseDetected) {
                // Name similarity: same last name + first 3 chars of first name match
                const refFirstName = d.firstName.trim().slice(0, 3).toUpperCase();
                const refLastName = d.lastName.trim().toUpperCase();
                const rFirstName = referrer.firstName.trim().slice(0, 3).toUpperCase();
                const rLastName = referrer.lastName.trim().toUpperCase();
                if (rLastName === refLastName && rFirstName === refFirstName) {
                  abuseDetected = true;
                  abuseReason = "Referred customer name too similar to referrer's name";
                }
              }

              if (!abuseDetected && Number(referrer.referralCreditGbp) >= REFERRAL_CREDIT_CAP_GBP) {
                // Hard cap: referrer already has the max £50 unredeemed credit — farming detected
                abuseDetected = true;
                abuseReason = `Referrer has reached the maximum pending reward limit (£${REFERRAL_CREDIT_CAP_GBP} credit)`;
              }

              if (abuseDetected) {
                // Flag the referred customer's account for admin review
                db.update(customersTable)
                  .set({ referralAbuseFlag: true })
                  .where(eq(customersTable.id, customerId!))
                  .catch(() => {});
                // Append abuse reason to this order's notes
                db.update(ordersTable)
                  .set({ notes: sql`COALESCE(notes || '; ', '') || ${'REFERRAL_ABUSE: ' + abuseReason}` })
                  .where(eq(ordersTable.id, order.id))
                  .catch(() => {});
              } else {
                const REFERRAL_REWARD_GBP = 25;
                // Both sides earn £25 credit, redeemable on their next order — capped at
                // £50 unredeemed balance each.
                await db
                  .update(customersTable)
                  .set({ referralCreditGbp: sql`LEAST(referral_credit_gbp + ${REFERRAL_REWARD_GBP}, ${REFERRAL_CREDIT_CAP_GBP})` })
                  .where(eq(customersTable.id, referrer.id));
                await db
                  .update(customersTable)
                  .set({ referralCreditGbp: sql`LEAST(referral_credit_gbp + ${REFERRAL_REWARD_GBP}, ${REFERRAL_CREDIT_CAP_GBP})` })
                  .where(eq(customersTable.id, customerId!));
                await sendReferralReward({
                  referrerName: `${referrer.firstName} ${referrer.lastName}`,
                  referrerEmail: referrer.email,
                  refereeName: customerName,
                });
              }
            }
          }
        } catch {}
      })();
    }

    const emailItems = cartItems.map(i => ({
      productName: i.productName,
      productCategory: i.productCategory,
      quantity: i.quantity,
      priceGbp: i.priceGbp,
    }));

    // ── BTCPay invoice (blocking — we need BTC details before responding) ──
    let btcAddress: string | null = null;
    let btcAmount: string | null = null;
    let btcPaymentUrl: string | null = null;
    let btcInvoiceId: string | null = null;

    // ── Wallid hosted-checkout payment (blocking — need redirect URL before responding) ──
    let wallidPaymentUrl: string | null = null;

    if (paymentMethodStr === "bitcoin" && cryptoCurrencyStr === "BTC") {
      try {
        const invoice = await createBtcPayInvoice({
          orderNumber,
          totalGbp,
          customerEmail: d.email.toLowerCase(),
          customerName,
        });
        if (invoice) {
          btcAddress = invoice.btcAddress || null;
          btcAmount = invoice.btcAmount || null;
          btcPaymentUrl = invoice.paymentUrl || null;
          btcInvoiceId = invoice.invoiceId;
          // Append invoice ID to order notes
          await db
            .update(ordersTable)
            .set({
              notes: [order.notes, `BTCPay invoice: ${invoice.invoiceId}`]
                .filter(Boolean)
                .join("; "),
            })
            .where(eq(ordersTable.id, order.id))
            .catch(() => {});
        }
      } catch (err) {
        req.log.warn({ err }, "BTCPay invoice creation failed — order still placed");
      }
    }

    if (paymentMethodStr === "wallid") {
      try {
        const origin =
          (req.headers.origin as string | undefined) ||
          process.env.SITE_URL ||
          "https://omniqure.com";
        const baseReturn =
          `${origin}/wallid-return` +
          `?order=${encodeURIComponent(orderNumber)}` +
          `&name=${encodeURIComponent(d.firstName)}` +
          `&total=${totalGbp.toFixed(2)}` +
          `&ship=${encodeURIComponent(shippingMethod)}`;
        const successUrl = `${baseReturn}&status=success`;
        const failUrl    = `${baseReturn}&status=failed`;

        // ⚠️ TEST MODE — charge £1 regardless of cart total; remove before go-live
        const TEST_AMOUNT_GBP = 1.00;
        const wallidItems: WallidItem[] = [{ name: "Test Order", category: "Peptides", price_minor: 100, image_url: `${origin}/og-image.jpg`, product_url: `${origin}/peptides` }];

        const wallid = await createWallidPayment({
          orderNumber,
          totalGbp: TEST_AMOUNT_GBP,
          customerEmail: d.email.toLowerCase(),
          successUrl,
          failUrl,
          items: wallidItems,
        });
        if (wallid) {
          wallidPaymentUrl = wallid.paymentUrl;
          await db
            .update(ordersTable)
            .set({
              notes: [order.notes, `Wallid payment id: ${wallid.apiPaymentId}`]
                .filter(Boolean)
                .join("; "),
            })
            .where(eq(ordersTable.id, order.id))
            .catch(() => {});
        }
      } catch (err) {
        req.log.warn({ err }, "Wallid payment creation failed — order still placed");
      }
    }

    // ── Payment-specific emails (non-blocking) ─────────────────────────────
    if (paymentMethodStr === "bitcoin") {
      const FALLBACK_BTC_ADDRESS = process.env.BITCOIN_ADDRESS ?? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
      sendBitcoinInstructions({
        orderNumber,
        customerName,
        customerEmail: d.email.toLowerCase(),
        totalGbp,
        btcAddress: btcAddress ?? FALLBACK_BTC_ADDRESS,
        btcAmount: btcAmount ?? undefined,
        items: emailItems,
        subtotalGbp,
        shippingCostGbp,
        shippingMethod,
      }).catch(() => {});
    } else if (paymentMethodStr === "wallid") {
      // Wallid: confirmation email is sent by the webhook handler once payment
      // is confirmed as SUCCESS — not here, to avoid sending before payment settles.
    } else if (paymentMethodStr === "bank_transfer" || paymentMethodStr === "bank") {
      // Bank transfer: send payment instructions (sort code, account number, reference)
      sendBankTransferInstructions({
        orderNumber,
        customerName,
        customerEmail: d.email.toLowerCase(),
        totalGbp,
        items: emailItems,
        subtotalGbp,
        shippingCostGbp,
        shippingMethod,
      }).catch(() => {});
    } else {
      sendOrderConfirmation({
        orderNumber,
        customerName,
        customerEmail: d.email.toLowerCase(),
        items: emailItems,
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
    }

    // Fire webhooks (non-blocking)
    dispatchWebhook("order.created", {
      orderId: order.id,
      orderNumber,
      customerName,
      customerEmail: d.email.toLowerCase(),
      totalGbp,
      status: "awaiting_payment",
      fraudScore,
      country: d.country,
    }).catch(() => {});

    res.status(201).json({
      orderNumber,
      customerName,
      totalGbp,
      shippingMethod,
      paymentMethod: paymentMethodStr,
      ...(paymentMethodStr === "bitcoin" && { cryptoCurrency: cryptoCurrencyStr }),
      ...(btcAddress    && { btcAddress }),
      ...(btcAmount     && { btcAmount }),
      ...(btcPaymentUrl && { btcPaymentUrl }),
      ...(btcInvoiceId  && { btcInvoiceId }),
      ...(wallidPaymentUrl && { wallidPaymentUrl }),
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

// ── Receipt HTML page ─────────────────────────────────────────────────────────
router.get("/orders/:orderNumber/receipt", async (req: Request, res: Response) => {
  const { orderNumber } = req.params as { orderNumber: string };
  try {
    const [order] = await db
      .select({
        id: ordersTable.id,
        orderNumber: ordersTable.orderNumber,
        customerName: ordersTable.customerName,
        customerEmail: ordersTable.customerEmail,
        subtotalGbp: ordersTable.subtotalGbp,
        shippingCostGbp: ordersTable.shippingCostGbp,
        totalGbp: ordersTable.totalGbp,
        shippingMethod: ordersTable.shippingMethod,
        address1: ordersTable.address1,
        address2: ordersTable.address2,
        city: ordersTable.city,
        postcode: ordersTable.postcode,
        country: ordersTable.country,
        createdAt: ordersTable.createdAt,
      })
      .from(ordersTable)
      .where(eq(ordersTable.orderNumber, orderNumber))
      .limit(1);

    if (!order) {
      res.status(404).send("<h2>Order not found</h2>");
      return;
    }

    const items = await db
      .select({
        productName: orderItemsTable.productName,
        productCategory: orderItemsTable.productCategory,
        quantity: orderItemsTable.quantity,
        priceGbp: orderItemsTable.priceGbp,
      })
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, order.id));

    const data: OrderEmailData = {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: items.map(i => ({
        productName: i.productName,
        productCategory: i.productCategory,
        quantity: i.quantity,
        priceGbp: parseFloat(String(i.priceGbp)),
      })),
      subtotalGbp: parseFloat(String(order.subtotalGbp)),
      shippingCostGbp: parseFloat(String(order.shippingCostGbp)),
      totalGbp: parseFloat(String(order.totalGbp)),
      shippingMethod: order.shippingMethod ?? null,
      trackingNumber: null,
      address1: order.address1 ?? null,
      address2: order.address2 ?? null,
      city: order.city ?? null,
      postcode: order.postcode ?? null,
      country: order.country ?? null,
    };

    const dateStr = order.createdAt.toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(generateReceiptHtml(data, dateStr));
  } catch (err) {
    req.log.error({ err }, "Failed to render receipt");
    res.status(500).send("<h2>Internal server error</h2>");
  }
});

export default router;
