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
  loyaltyTransactionsTable,
  giftCardsTable,
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
} from "../lib/email";
import { createBtcPayInvoice, isBtcPayConfigured } from "../lib/btcpay";
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
    giftCardCode,
    paymentMethod,
    redeemFreePeptide,
  } = req.body as {
    delivery: unknown;
    shippingMethod: unknown;
    shippingCostGbp: unknown;
    items: unknown;
    discountCode?: unknown;
    loyaltyPointsRedeemed?: unknown;
    giftCardCode?: unknown;
    paymentMethod?: unknown;
    redeemFreePeptide?: unknown;
  };

  const paymentMethodStr = typeof paymentMethod === "string" ? paymentMethod : "card";

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

    // Validate free peptide credit redemption
    let freePeptideDeductGbp = 0;
    let freePeptideCreditUsed = false;
    if (redeemFreePeptide === true && loyaltySessionCustomerId) {
      const [custCredit] = await db
        .select({ freePeptideCredits: customersTable.freePeptideCredits })
        .from(customersTable)
        .where(eq(customersTable.id, loyaltySessionCustomerId))
        .limit(1);
      if (custCredit && custCredit.freePeptideCredits > 0) {
        const cheapestPrice = Math.min(...(cartItems as CartItem[]).map(i => i.priceGbp));
        freePeptideDeductGbp = cheapestPrice;
        freePeptideCreditUsed = true;
      }
    }

    // Validate gift card if provided
    let giftCardDeductGbp = 0;
    let validatedGiftCardCode: string | null = null;
    let giftCardId: number | null = null;
    if (giftCardCode && typeof giftCardCode === "string" && giftCardCode.trim()) {
      const normalizedCode = giftCardCode.trim().toUpperCase();
      const [card] = await db
        .select()
        .from(giftCardsTable)
        .where(eq(giftCardsTable.code, normalizedCode))
        .limit(1);
      if (card && card.isActive) {
        const remaining = parseFloat(String(card.remainingGbp));
        if (remaining > 0) {
          validatedGiftCardCode = card.code;
          giftCardId = card.id;
          giftCardDeductGbp = remaining;
        }
      }
    }

    const subtotalGbp = cartItems.reduce((s, i) => s + i.priceGbp * i.quantity, 0);
    const preGiftTotal = Math.max(0, subtotalGbp + shippingCostGbp - discountAmount - loyaltyDiscountGbp - freePeptideDeductGbp);
    if (giftCardDeductGbp > preGiftTotal) giftCardDeductGbp = preGiftTotal;
    const totalGbp = Math.max(0, preGiftTotal - giftCardDeductGbp);

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
        shippingCostGbp: String(shippingCostGbp.toFixed(2)),
        totalGbp: String(totalGbp.toFixed(2)),
        shippingMethod,
        status: ["bank_transfer", "bitcoin", "card"].includes(paymentMethodStr) ? "awaiting_payment" : "pending" as const,
        notes: [
          `Payment method: ${paymentMethodStr}`,
          validatedDiscountCode ? `Discount: ${validatedDiscountCode} (-£${discountAmount.toFixed(2)})` : null,
          loyaltyPointsToDeduct > 0 ? `Loyalty: ${loyaltyPointsToDeduct} pts redeemed (-£${loyaltyDiscountGbp.toFixed(2)})` : null,
          validatedGiftCardCode ? `Gift card: ${validatedGiftCardCode} (-£${giftCardDeductGbp.toFixed(2)})` : null,
        ].filter(Boolean).join("; ") || null,
        fraudScore,
        fraudFlags,
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
          .set({ freePeptideCredits: sql`GREATEST(free_peptide_credits - 1, 0)` })
          .where(eq(customersTable.id, loyaltyCustomerId))
          .catch(() => {});
      }
    }

    // Deduct gift card balance
    if (giftCardId && giftCardDeductGbp > 0) {
      const [existingCard] = await db.select({ remainingGbp: giftCardsTable.remainingGbp }).from(giftCardsTable).where(eq(giftCardsTable.id, giftCardId)).limit(1);
      if (existingCard) {
        const newRemaining = Math.max(0, parseFloat(String(existingCard.remainingGbp)) - giftCardDeductGbp);
        await db.update(giftCardsTable).set({
          remainingGbp: String(newRemaining.toFixed(2)),
          ...(newRemaining === 0 ? { redeemedAt: new Date() } : {}),
        }).where(eq(giftCardsTable.id, giftCardId));
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
      if (item.productId) {
        const [before] = await db
          .select({ stockLevel: productsInventoryTable.stockLevel })
          .from(productsInventoryTable)
          .where(eq(productsInventoryTable.productId, item.productId))
          .limit(1);
        const qBefore = before?.stockLevel ?? 0;
        await db
          .update(productsInventoryTable)
          .set({ stockLevel: sql`GREATEST(${productsInventoryTable.stockLevel} - ${item.quantity}, 0)` })
          .where(eq(productsInventoryTable.productId, item.productId));
        const qAfter = Math.max(0, qBefore - item.quantity);
        db.insert(inventoryAuditLogTable).values({
          productId: item.productId,
          productName: item.productName,
          changeType: "sale",
          quantityBefore: qBefore,
          quantityAfter: qAfter,
          quantityChange: -(item.quantity),
          reason: `Sold via order ${orderNumber}`,
          referenceId: orderNumber,
          referenceType: "order",
        }).catch(() => {});
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
          if (cust?.totalOrders === 1) {
            sendWelcomeEmail({ customerName, customerEmail: d.email.toLowerCase() }).catch(() => {});
          }
          if (cust?.totalOrders === 1 && cust.referredBy) {
            const [referrer] = await db
              .select({ id: customersTable.id, email: customersTable.email, firstName: customersTable.firstName, lastName: customersTable.lastName, lastSeenIp: customersTable.lastSeenIp, knownIps: customersTable.knownIps })
              .from(customersTable)
              .where(eq(customersTable.referralCode, cust.referredBy))
              .limit(1);
            if (referrer) {
              // IP abuse checks — block reward if any of the following are true:
              // 1. New customer is using a VPN / proxy / hosting IP (can mask identity)
              // 2. New customer's IP matches any IP ever seen on the referrer's account
              // 3. New customer's IP matches any IP ever seen on any other existing customer
              let abuseDetected = false;

              if (ipData.isProxy) {
                // VPN, proxy, or datacenter IP — could be masking a self-referral
                abuseDetected = true;
              }

              if (!abuseDetected && clientIp) {
                // Check referrer's full IP history (not just last seen)
                const referrerKnownIps: string[] = referrer.knownIps ?? (referrer.lastSeenIp ? [referrer.lastSeenIp] : []);
                if (referrerKnownIps.includes(clientIp)) {
                  abuseDetected = true;
                }
              }

              if (!abuseDetected && clientIp) {
                // Check if this IP appears on ANY other customer account (multi-account abuse)
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
                if (anyIpConflict) abuseDetected = true;
              }

              if (!abuseDetected) {
                await db
                  .update(customersTable)
                  .set({ freePeptideCredits: sql`free_peptide_credits + 1` })
                  .where(eq(customersTable.id, referrer.id));
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

    if (paymentMethodStr === "bitcoin") {
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

    // ── Payment-specific emails (non-blocking) ─────────────────────────────
    if (paymentMethodStr === "bank_transfer") {
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
    } else if (paymentMethodStr === "bitcoin") {
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
      ...(btcAddress   && { btcAddress }),
      ...(btcAmount    && { btcAmount }),
      ...(btcPaymentUrl && { btcPaymentUrl }),
      ...(btcInvoiceId  && { btcInvoiceId }),
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
