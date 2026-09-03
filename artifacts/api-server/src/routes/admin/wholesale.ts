import { Router, type Request, type Response } from "express";
import {
  db,
  orderItemsTable,
  ordersTable,
  productsCatalogTable,
  wholesaleInvoicesTable,
} from "@workspace/db";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { createWallidPayment } from "../../lib/wallid";
import { sendWholesaleInvoice, type WholesaleInvoiceEmailData } from "../../lib/email";

const SITE_URL = process.env.SITE_URL ?? "https://omniqure.com";
export const WHOLESALE_PAYMENT_CREATION_LEASE_MS = 5 * 60_000;

type CreateBody = {
  referenceNumber?: unknown;
  currency?: unknown;
  customerName?: unknown;
  customerEmail?: unknown;
  customerEmailCc?: unknown;
  dueDate?: unknown;
  description?: unknown;
  notes?: unknown;
  phone?: unknown;
  address1?: unknown;
  address2?: unknown;
  city?: unknown;
  county?: unknown;
  postcode?: unknown;
  country?: unknown;
  shippingCostGbp?: unknown;
  items?: unknown;
};

type UpdateBody = {
  customerName?: unknown;
  customerEmail?: unknown;
  customerEmailCc?: unknown;
  dueDate?: unknown;
  description?: unknown;
  notes?: unknown;
};

type ResolveBody = {
  apiPaymentId?: unknown;
  paymentUrl?: unknown;
};

const UNKNOWN_PAYMENT_ERROR =
  "Wallid creation may have succeeded, but the result is unknown. Inspect the Wallid dashboard and manually attach the verified payment ID and URL; do not create another payment.";

function text(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function validEmail(value: string | null): value is string {
  return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function absoluteHttpsUrl(value: string | null | undefined, fallbackPath: string): string {
  try {
    const url = new URL(value || fallbackPath, SITE_URL);
    if (url.protocol === "https:") return url.toString();
  } catch {
    // Use the known site fallback below.
  }
  return new URL(fallbackPath, SITE_URL).toString();
}

function verifiedWallidPaymentUrl(value: unknown): string | null {
  const candidate = text(value, 2_000);
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    const hostname = url.hostname.toLowerCase();
    const isWallidHost = ["wallid.co", "wallid.io", "wallid.test"].some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
    if (url.protocol !== "https:" || !isWallidHost || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function invoiceResponse(invoice: typeof wholesaleInvoicesTable.$inferSelect, order: typeof ordersTable.$inferSelect) {
  return {
    id: invoice.id,
    orderId: order.id,
    orderNumber: order.orderNumber,
    referenceNumber: invoice.referenceNumber,
    status: order.status,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    currency: order.paymentCurrency === "EUR" ? "EUR" : "GBP",
    customerEmailCc: invoice.customerEmailCc,
    dueDate: invoice.dueDate,
    description: invoice.description,
    invoiceNotes: invoice.invoiceNotes,
    totalGbp: Number(order.totalGbp),
    paymentUrl: invoice.paymentUrl,
    paymentStatus: invoice.paymentStatus,
    paymentLastError: invoice.paymentLastError,
    paymentCreationStale: invoice.paymentStatus === "creating" &&
      invoice.updatedAt.getTime() <= Date.now() - WHOLESALE_PAYMENT_CREATION_LEASE_MS,
    emailStatus: invoice.emailStatus,
    invoiceSentAt: invoice.invoiceSentAt?.toISOString() ?? null,
    createdAt: invoice.createdAt.toISOString(),
  };
}

type WholesaleDependencies = {
  createPayment: typeof createWallidPayment;
  sendInvoice: (invoice: WholesaleInvoiceEmailData) => Promise<void>;
};

/**
 * The router is a factory so integration tests can replace only external
 * boundaries. Production always uses the Wallid and email implementations.
 */
export function createWholesaleRouter(
  dependencies: Partial<WholesaleDependencies> = {},
): Router {
  const router = Router();
  const createPayment = dependencies.createPayment ?? createWallidPayment;
  const sendInvoice = dependencies.sendInvoice ?? sendWholesaleInvoice;

  async function sendSavedInvoice(invoiceId: number): Promise<void> {
  const [row] = await db
    .select({ invoice: wholesaleInvoicesTable, order: ordersTable })
    .from(wholesaleInvoicesTable)
    .innerJoin(ordersTable, eq(wholesaleInvoicesTable.orderId, ordersTable.id))
    .where(eq(wholesaleInvoicesTable.id, invoiceId))
    .limit(1);
  if (!row?.invoice.paymentUrl) throw new Error("Payment link is not ready");
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, row.order.id));
  await sendInvoice({
    referenceNumber: row.invoice.referenceNumber,
    dueDate: row.invoice.dueDate,
    paymentUrl: row.invoice.paymentUrl,
    currency: row.order.paymentCurrency === "EUR" ? "EUR" : "GBP",
    customerEmailCc: row.invoice.customerEmailCc,
    description: row.invoice.description,
    invoiceNotes: row.invoice.invoiceNotes,
    orderNumber: row.order.orderNumber,
    customerName: row.order.customerName,
    customerEmail: row.order.customerEmail,
    items: items.map((item) => ({
      productName: item.productName,
      productCategory: item.productCategory,
      quantity: item.quantity,
      priceGbp: Number(item.priceGbp),
    })),
    subtotalGbp: Number(row.order.subtotalGbp),
    shippingCostGbp: Number(row.order.shippingCostGbp),
    totalGbp: Number(row.order.totalGbp),
    shippingMethod: row.order.shippingMethod,
    trackingNumber: row.order.trackingNumber,
    address1: row.order.address1,
    address2: row.order.address2,
    city: row.order.city,
    postcode: row.order.postcode,
    country: row.order.country,
  });
  }

  router.get("/admin/wholesale", async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await db
      .select({ invoice: wholesaleInvoicesTable, order: ordersTable })
      .from(wholesaleInvoicesTable)
      .innerJoin(ordersTable, eq(wholesaleInvoicesTable.orderId, ordersTable.id))
      .orderBy(desc(wholesaleInvoicesTable.createdAt))
      .limit(50);
    res.json({ invoices: rows.map(({ invoice, order }) => invoiceResponse(invoice, order)) });
  } catch (err) {
    res.status(500).json({ error: "Failed to list wholesale invoices" });
  }
  });

router.post("/admin/wholesale", async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CreateBody;
  const referenceNumber = text(body.referenceNumber, 64);
  const customerName = text(body.customerName, 160);
  const customerEmail = text(body.customerEmail, 320)?.toLowerCase() ?? null;
  const customerEmailCc = text(body.customerEmailCc, 320)?.toLowerCase() ?? null;
  const currency = body.currency === undefined || body.currency === null || body.currency === "GBP"
    ? "GBP"
    : body.currency === "EUR"
      ? "EUR"
      : null;
  const dueDate = text(body.dueDate, 10);
  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (
    !referenceNumber || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(referenceNumber) ||
    !currency ||
    !customerName || !validEmail(customerEmail) ||
    (customerEmailCc && !validEmail(customerEmailCc)) ||
    !dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
    rawItems.length === 0 || rawItems.length > 100
  ) {
    res.status(400).json({ error: "Check the reference, customer, due date, and product lines" });
    return;
  }

  const items = rawItems.map((raw) => {
    const value = raw as Record<string, unknown>;
    return {
      productId: Number(value.productId),
      quantity: Number(value.quantity),
      priceGbp: Number(value.priceGbp),
    };
  });
  if (
    items.some((item) => !Number.isInteger(item.productId) || item.productId <= 0 ||
      !Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 1000 ||
      !Number.isFinite(item.priceGbp) || item.priceGbp <= 0 || item.priceGbp > 1_000_000) ||
    new Set(items.map((item) => item.productId)).size !== items.length
  ) {
    res.status(400).json({ error: "Each product must be unique with a valid quantity and price" });
    return;
  }

  const productIds = items.map((item) => item.productId);
  const products = await db.select().from(productsCatalogTable).where(and(
    inArray(productsCatalogTable.id, productIds),
    eq(productsCatalogTable.isPublished, true),
  ));
  if (products.length !== productIds.length) {
    res.status(400).json({ error: "One or more catalogue products are unavailable" });
    return;
  }
  const productById = new Map(products.map((product) => [product.id, product]));
  const requestedShippingCost = Number(body.shippingCostGbp ?? 0);
  if (!Number.isFinite(requestedShippingCost) || requestedShippingCost !== 0) {
    res.status(400).json({ error: "The wholesale total is calculated from line items only" });
    return;
  }
  const subtotal = items.reduce((sum, item) => sum + item.priceGbp * item.quantity, 0);
  const shippingCost = 0;
  const total = Math.round(subtotal * 100) / 100;
  const amountMinor = Math.round(total * 100);
  const orderNumber = `WS-${referenceNumber}`;
  const paymentExpiresAt = new Date(`${dueDate}T23:59:59.999Z`);
  if (!Number.isFinite(paymentExpiresAt.getTime()) || paymentExpiresAt.getTime() <= Date.now()) {
    res.status(400).json({ error: "The due date must be in the future" });
    return;
  }

  try {
    const [saved] = await db
      .select({ invoice: wholesaleInvoicesTable, order: ordersTable })
      .from(wholesaleInvoicesTable)
      .innerJoin(ordersTable, eq(wholesaleInvoicesTable.orderId, ordersTable.id))
      .where(eq(wholesaleInvoicesTable.referenceNumber, referenceNumber))
      .limit(1);

    let created: {
      order: typeof ordersTable.$inferSelect;
      invoice: typeof wholesaleInvoicesTable.$inferSelect;
    };

    if (saved) {
      const savedItems = await db
        .select()
        .from(orderItemsTable)
        .where(eq(orderItemsTable.orderId, saved.order.id));
      const requestedItems = [...items].sort((a, b) => a.productId - b.productId);
      const existingItems = [...savedItems].sort((a, b) => (a.productId ?? 0) - (b.productId ?? 0));
      const sameItems = requestedItems.length === existingItems.length &&
        requestedItems.every((item, index) => {
          const existing = existingItems[index];
          return existing?.productId === item.productId &&
            existing.quantity === item.quantity &&
            Number(existing.priceGbp) === item.priceGbp;
        });
      const sameRequest =
        saved.order.orderNumber === orderNumber &&
        saved.order.customerEmail.toLowerCase() === customerEmail &&
        saved.order.customerName === customerName &&
        saved.order.paymentAmountMinor === amountMinor &&
        (saved.order.paymentCurrency ?? "GBP") === currency &&
        sameItems;

      if (!sameRequest) {
        res.status(409).json({ error: "That reference number belongs to a different wholesale payment" });
        return;
      }
      if (saved.invoice.paymentUrl && saved.invoice.apiPaymentId) {
        const canRepair = saved.order.status !== "paid" && saved.invoice.paymentStatus !== "paid";
        if (canRepair && (saved.order.status === "pending" || saved.invoice.paymentStatus !== "ready")) {
          await db.transaction(async (tx) => {
            if (saved.order.status === "pending") {
              const paymentNote = `Wallid payment id: ${saved.invoice.apiPaymentId}`;
              await tx.update(ordersTable).set({
                status: "awaiting_payment",
                notes: saved.order.notes?.includes(paymentNote)
                  ? saved.order.notes
                  : `${saved.order.notes ?? ""}\n${paymentNote}`.trim(),
                updatedAt: new Date(),
              }).where(and(
                eq(ordersTable.id, saved.order.id),
                ne(ordersTable.status, "paid"),
              ));
            }
            if (saved.invoice.paymentStatus !== "ready") {
              await tx.update(wholesaleInvoicesTable).set({
                paymentStatus: "ready",
                paymentLastError: null,
                updatedAt: new Date(),
              }).where(and(
                eq(wholesaleInvoicesTable.id, saved.invoice.id),
                ne(wholesaleInvoicesTable.paymentStatus, "paid"),
              ));
            }
          });
        }
        const [latest] = await db
          .select({ invoice: wholesaleInvoicesTable, order: ordersTable })
          .from(wholesaleInvoicesTable)
          .innerJoin(ordersTable, eq(wholesaleInvoicesTable.orderId, ordersTable.id))
          .where(eq(wholesaleInvoicesTable.id, saved.invoice.id))
          .limit(1);
        const responseState = latest ?? saved;
        res.status(200).json({
          invoice: invoiceResponse(responseState.invoice, responseState.order),
          warning: responseState.invoice.emailStatus === "sent"
            ? "This payment link already exists and has already been emailed."
            : "This payment link already exists. Use Resend if the customer has not received it.",
        });
        return;
      }
      if (saved.invoice.apiPaymentId || saved.invoice.paymentUrl) {
        res.status(409).json({ error: "This invoice has incomplete provider data and cannot safely create another payment link" });
        return;
      }
      if (saved.invoice.paymentStatus === "creating") {
        const leaseCutoff = new Date(Date.now() - WHOLESALE_PAYMENT_CREATION_LEASE_MS);
        if (saved.invoice.updatedAt > leaseCutoff) {
          res.status(409).json({ error: "This payment link is already being created. Refresh the list in a moment." });
          return;
        }
        await db.update(wholesaleInvoicesTable).set({
          paymentStatus: "unknown",
          paymentLastError: UNKNOWN_PAYMENT_ERROR,
          updatedAt: new Date(),
        }).where(and(
          eq(wholesaleInvoicesTable.id, saved.invoice.id),
          eq(wholesaleInvoicesTable.paymentStatus, "creating"),
        ));
        res.status(409).json({ error: UNKNOWN_PAYMENT_ERROR });
        return;
      }
      res.status(409).json({
        error: saved.invoice.paymentLastError || "This payment outcome cannot be retried safely. Inspect Wallid and use manual recovery.",
      });
      return;
    } else {
      created = await db.transaction(async (tx) => {
        const [order] = await tx.insert(ordersTable).values({
          orderNumber,
          status: "pending",
          customerEmail,
          customerName,
          phone: text(body.phone, 40),
          address1: text(body.address1, 200),
          address2: text(body.address2, 200),
          city: text(body.city, 100),
          county: text(body.county, 100),
          postcode: text(body.postcode, 24),
          country: text(body.country, 80) ?? "United Kingdom",
          subtotalGbp: subtotal.toFixed(2),
          shippingCostGbp: shippingCost.toFixed(2),
          totalGbp: total.toFixed(2),
          paymentCurrency: currency,
          paymentAmountMinor: amountMinor,
          shippingMethod: "Wholesale",
          notes: ["Wholesale Pay by Bank invoice", text(body.notes, 2000)].filter(Boolean).join("\n"),
          fraudFlags: ["bank_transfer_payment"],
        }).returning();
        await tx.insert(orderItemsTable).values(items.map((item) => {
          const product = productById.get(item.productId)!;
          return {
            orderId: order.id,
            productId: product.id,
            productName: product.name,
            productCategory: product.category,
            quantity: item.quantity,
            priceGbp: item.priceGbp.toFixed(2),
          };
        }));
        const [invoice] = await tx.insert(wholesaleInvoicesTable).values({
          orderId: order.id,
          referenceNumber,
          customerEmailCc,
          dueDate,
          description: text(body.description, 2000),
          invoiceNotes: text(body.notes, 2000),
        }).returning();
        return { order, invoice };
      });
    }

    let payment: Awaited<ReturnType<typeof createPayment>> = null;
    try {
      payment = await createPayment({
        orderNumber,
        amountMinor,
        currency,
        customerEmail,
        customerId: `wholesale-${created.order.id}`,
        successUrl: `${SITE_URL}/wallid-return?order=${encodeURIComponent(orderNumber)}&status=success`,
        failUrl: `${SITE_URL}/wallid-return?order=${encodeURIComponent(orderNumber)}&status=failed`,
        expiresAt: paymentExpiresAt.toISOString(),
        items: items.map((item) => {
          const product = productById.get(item.productId)!;
          return {
            name: `${product.name} x ${item.quantity}`,
            category: product.category,
            price_minor: Math.round(item.priceGbp * item.quantity * 100),
            image_url: absoluteHttpsUrl(product.imageUrl, "/omniqure-email-header.png"),
            product_url: absoluteHttpsUrl(`/product/${product.slug}`, "/"),
          };
        }),
      });
    } catch (err) {
      req.log.error({ err, orderId: created.order.id }, "Wallid payment creation outcome unknown");
    }
    if (!payment) {
      await db.update(wholesaleInvoicesTable).set({
        paymentStatus: "unknown",
        paymentLastError: UNKNOWN_PAYMENT_ERROR,
        updatedAt: new Date(),
      }).where(eq(wholesaleInvoicesTable.id, created.invoice.id));
      res.status(502).json({ error: UNKNOWN_PAYMENT_ERROR, orderId: created.order.id });
      return;
    }

    let invoice: typeof wholesaleInvoicesTable.$inferSelect;
    let order: typeof ordersTable.$inferSelect;
    try {
      ({ invoice, order } = await db.transaction(async (tx) => {
        const [savedInvoice] = await tx.update(wholesaleInvoicesTable).set({
          paymentStatus: "ready",
          apiPaymentId: payment.apiPaymentId,
          paymentUrl: payment.paymentUrl,
          paymentLastError: null,
          updatedAt: new Date(),
        }).where(eq(wholesaleInvoicesTable.id, created.invoice.id)).returning();
        const [savedOrder] = await tx.update(ordersTable).set({
          status: "awaiting_payment",
          notes: `${created.order.notes ?? ""}\nWallid payment id: ${payment.apiPaymentId}`.trim(),
          updatedAt: new Date(),
        }).where(eq(ordersTable.id, created.order.id)).returning();
        return { invoice: savedInvoice, order: savedOrder };
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message.slice(0, 500) : "Local payment link persistence failed";
      await db.update(wholesaleInvoicesTable).set({
        paymentStatus: "failed",
        paymentLastError: message,
        apiPaymentId: payment.apiPaymentId,
        paymentUrl: payment.paymentUrl,
        updatedAt: new Date(),
      }).where(eq(wholesaleInvoicesTable.id, created.invoice.id));
      req.log.error({ err, orderId: created.order.id }, "Wallid link created but local readiness update failed");
      res.status(502).json({
        error: "Wallid created the payment link, but the order could not be made ready. Retry this invoice to repair it.",
        orderId: created.order.id,
      });
      return;
    }

    let warning: string | null = null;
    try {
      await sendSavedInvoice(invoice.id);
      await db.update(wholesaleInvoicesTable).set({ emailStatus: "sent", invoiceSentAt: new Date(), emailLastError: null, updatedAt: new Date() }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      invoice.emailStatus = "sent";
      invoice.invoiceSentAt = new Date();
    } catch (err) {
      warning = "Payment link created, but the invoice email could not be sent. You can resend it from this page.";
      await db.update(wholesaleInvoicesTable).set({ emailStatus: "failed", emailLastError: err instanceof Error ? err.message.slice(0, 500) : "Email failed", updatedAt: new Date() }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      invoice.emailStatus = "failed";
    }
    res.status(201).json({ invoice: invoiceResponse(invoice, order), warning });
  } catch (err) {
    const code = (err as { code?: string; cause?: { code?: string } }).code ??
      (err as { cause?: { code?: string } }).cause?.code;
    if (code === "23505") {
      res.status(409).json({ error: "That reference number has already been used" });
      return;
    }
    req.log.error({ err }, "Failed to create wholesale invoice");
    res.status(500).json({ error: "Failed to create wholesale invoice" });
  }
});

router.post("/admin/wholesale/:id/resolve", async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const body = req.body as ResolveBody;
  const apiPaymentId = text(body.apiPaymentId, 500);
  const paymentUrl = verifiedWallidPaymentUrl(body.paymentUrl);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid invoice ID" });
    return;
  }
  if (!apiPaymentId) {
    res.status(400).json({ error: "Enter the Wallid API payment ID" });
    return;
  }
  if (!paymentUrl) {
    res.status(400).json({ error: "Enter a valid HTTPS Wallid payment URL" });
    return;
  }

  try {
    const { invoice, order } = await db.transaction(async (tx) => {
      const [saved] = await tx
        .select({ invoice: wholesaleInvoicesTable, order: ordersTable })
        .from(wholesaleInvoicesTable)
        .innerJoin(ordersTable, eq(wholesaleInvoicesTable.orderId, ordersTable.id))
        .where(eq(wholesaleInvoicesTable.id, id))
        .limit(1)
        .for("update");
      if (!saved) throw new Error("NOT_FOUND");
      if (saved.invoice.paymentStatus === "paid" || saved.order.status === "paid") {
        throw new Error("PAID");
      }
      if (
        (saved.invoice.apiPaymentId && saved.invoice.apiPaymentId !== apiPaymentId) ||
        (saved.invoice.paymentUrl && saved.invoice.paymentUrl !== paymentUrl)
      ) {
        throw new Error("DIFFERENT_PROVIDER_PAYMENT");
      }
      const [duplicate] = await tx.select({ id: wholesaleInvoicesTable.id })
        .from(wholesaleInvoicesTable)
        .where(and(
          eq(wholesaleInvoicesTable.apiPaymentId, apiPaymentId),
          ne(wholesaleInvoicesTable.id, id),
        ))
        .limit(1);
      if (duplicate) throw new Error("DUPLICATE_PROVIDER_ID");

      const now = new Date();
      const paymentNote = `Wallid payment id: ${apiPaymentId}`;
      const [readyInvoice] = await tx.update(wholesaleInvoicesTable).set({
        apiPaymentId,
        paymentUrl,
        paymentStatus: "ready",
        paymentLastError: null,
        updatedAt: now,
      }).where(and(
        eq(wholesaleInvoicesTable.id, id),
        ne(wholesaleInvoicesTable.paymentStatus, "paid"),
      )).returning();
      const [readyOrder] = await tx.update(ordersTable).set({
        status: "awaiting_payment",
        notes: saved.order.notes?.includes(paymentNote)
          ? saved.order.notes
          : `${saved.order.notes ?? ""}\n${paymentNote}`.trim(),
        updatedAt: now,
      }).where(and(
        eq(ordersTable.id, saved.order.id),
        ne(ordersTable.status, "paid"),
      )).returning();
      if (!readyInvoice || !readyOrder) throw new Error("PAID");
      return { invoice: readyInvoice, order: readyOrder };
    });

    req.log.info({ invoiceId: id, orderId: order.id, apiPaymentId }, "Manually resolved wholesale Wallid payment");
    let warning: string | null = null;
    try {
      await sendSavedInvoice(invoice.id);
      const sentAt = new Date();
      await db.update(wholesaleInvoicesTable).set({
        emailStatus: "sent",
        invoiceSentAt: sentAt,
        emailLastError: null,
        updatedAt: sentAt,
      }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      invoice.emailStatus = "sent";
      invoice.invoiceSentAt = sentAt;
    } catch (err) {
      warning = "Payment link was attached, but the invoice email could not be sent. You can resend it from this page.";
      await db.update(wholesaleInvoicesTable).set({
        emailStatus: "failed",
        emailLastError: err instanceof Error ? err.message.slice(0, 500) : "Email failed",
        updatedAt: new Date(),
      }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      invoice.emailStatus = "failed";
    }
    res.json({ invoice: invoiceResponse(invoice, order), warning });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    const code = (err as { code?: string; cause?: { code?: string } }).code ??
      (err as { cause?: { code?: string } }).cause?.code;
    if (message === "NOT_FOUND") {
      res.status(404).json({ error: "Wholesale invoice not found" });
    } else if (message === "PAID") {
      res.status(409).json({ error: "Paid wholesale invoices cannot be manually resolved" });
    } else if (message === "DIFFERENT_PROVIDER_PAYMENT") {
      res.status(409).json({ error: "This invoice is already linked to a different Wallid payment" });
    } else if (message === "DUPLICATE_PROVIDER_ID" || code === "23505") {
      res.status(409).json({ error: "That Wallid API payment ID is already attached to another invoice" });
    } else {
      req.log.error({ err, invoiceId: id }, "Failed to manually resolve wholesale payment");
      res.status(500).json({ error: "Failed to attach the verified Wallid payment" });
    }
  }
});

router.post("/admin/wholesale/:id/retry", async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid invoice ID" });
    return;
  }

  try {
    const [saved] = await db
      .select({ invoice: wholesaleInvoicesTable, order: ordersTable })
      .from(wholesaleInvoicesTable)
      .innerJoin(ordersTable, eq(wholesaleInvoicesTable.orderId, ordersTable.id))
      .where(eq(wholesaleInvoicesTable.id, id))
      .limit(1);
    if (!saved) {
      res.status(404).json({ error: "Wholesale invoice not found" });
      return;
    }
    if (saved.invoice.paymentStatus === "paid" || saved.order.status === "paid") {
      res.status(409).json({ error: "Paid wholesale invoices cannot be retried" });
      return;
    }

    let invoice = saved.invoice;
    let order = saved.order;
    const hasProviderLink = Boolean(invoice.apiPaymentId && invoice.paymentUrl);
    if (hasProviderLink) {
      const paymentNote = `Wallid payment id: ${invoice.apiPaymentId}`;
      try {
        ({ invoice, order } = await db.transaction(async (tx) => {
          const [readyInvoice] = await tx.update(wholesaleInvoicesTable).set({
            paymentStatus: "ready",
            paymentLastError: null,
            updatedAt: new Date(),
          }).where(and(
            eq(wholesaleInvoicesTable.id, invoice.id),
            ne(wholesaleInvoicesTable.paymentStatus, "paid"),
          )).returning();
          const [readyOrder] = await tx.update(ordersTable).set({
            status: "awaiting_payment",
            notes: order.notes?.includes(paymentNote)
              ? order.notes
              : `${order.notes ?? ""}\n${paymentNote}`.trim(),
            updatedAt: new Date(),
          }).where(and(
            eq(ordersTable.id, order.id),
            ne(ordersTable.status, "paid"),
          )).returning();
          if (!readyInvoice || !readyOrder) throw new Error("Paid wholesale invoices cannot be retried");
          return { invoice: readyInvoice, order: readyOrder };
        }));
      } catch (err) {
        if (err instanceof Error && err.message === "Paid wholesale invoices cannot be retried") {
          res.status(409).json({ error: err.message });
          return;
        }
        const message = err instanceof Error ? err.message.slice(0, 500) : "Local payment link repair failed";
        await db.update(wholesaleInvoicesTable).set({
          paymentStatus: "failed",
          paymentLastError: message,
          updatedAt: new Date(),
        }).where(and(
          eq(wholesaleInvoicesTable.id, invoice.id),
          ne(wholesaleInvoicesTable.paymentStatus, "paid"),
        ));
        req.log.error({ err, orderId: order.id }, "Failed to repair provider-known wholesale payment");
        res.status(502).json({
          error: "The existing Wallid payment link could not be made ready. Retry this invoice again.",
        });
        return;
      }
    } else {
      if (invoice.apiPaymentId || invoice.paymentUrl) {
        res.status(409).json({ error: "This invoice has incomplete provider data and cannot safely create another payment link" });
        return;
      }

      const leaseCutoff = new Date(Date.now() - WHOLESALE_PAYMENT_CREATION_LEASE_MS);
      if (invoice.paymentStatus === "creating" && invoice.updatedAt > leaseCutoff) {
        res.status(409).json({ error: "This payment link is already being created. Try again after five minutes." });
        return;
      }
      if (invoice.paymentStatus === "creating") {
        await db.update(wholesaleInvoicesTable).set({
          paymentStatus: "unknown",
          paymentLastError: UNKNOWN_PAYMENT_ERROR,
          updatedAt: new Date(),
        }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      }
      res.status(409).json({
        error: invoice.paymentStatus === "creating"
          ? UNKNOWN_PAYMENT_ERROR
          : invoice.paymentLastError || "This payment outcome cannot be retried safely. Inspect Wallid and use manual recovery.",
      });
      return;
    }

    let warning: string | null = null;
    try {
      await sendSavedInvoice(invoice.id);
      const sentAt = new Date();
      await db.update(wholesaleInvoicesTable).set({
        emailStatus: "sent",
        invoiceSentAt: sentAt,
        emailLastError: null,
        updatedAt: sentAt,
      }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      invoice.emailStatus = "sent";
      invoice.invoiceSentAt = sentAt;
    } catch (err) {
      warning = "Payment link is ready, but the invoice email could not be sent. You can resend it from this page.";
      await db.update(wholesaleInvoicesTable).set({
        emailStatus: "failed",
        emailLastError: err instanceof Error ? err.message.slice(0, 500) : "Email failed",
        updatedAt: new Date(),
      }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      invoice.emailStatus = "failed";
    }
    res.json({ invoice: invoiceResponse(invoice, order), warning });
  } catch (err) {
    req.log.error({ err, invoiceId: id }, "Failed to retry wholesale payment link");
    res.status(500).json({ error: "Failed to retry wholesale payment link" });
  }
});

router.post("/admin/wholesale/:id/resend", async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid invoice ID" });
    return;
  }
  try {
    await sendSavedInvoice(id);
    await db.update(wholesaleInvoicesTable).set({ emailStatus: "sent", invoiceSentAt: new Date(), emailLastError: null, updatedAt: new Date() }).where(eq(wholesaleInvoicesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    await db.update(wholesaleInvoicesTable).set({ emailStatus: "failed", emailLastError: err instanceof Error ? err.message.slice(0, 500) : "Email failed", updatedAt: new Date() }).where(eq(wholesaleInvoicesTable.id, id));
    res.status(502).json({ error: "Invoice email could not be sent" });
  }
});

router.patch("/admin/wholesale/:id", async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid invoice ID" });
    return;
  }

  const body = req.body as UpdateBody;
  const customerName = text(body.customerName, 160);
  const customerEmail = text(body.customerEmail, 320)?.toLowerCase() ?? null;
  const rawCc = body.customerEmailCc;
  const customerEmailCc = rawCc === null || rawCc === undefined
    ? null
    : text(rawCc, 320)?.toLowerCase() ?? null;
  const dueDate = text(body.dueDate, 10);
  const description = body.description === null || body.description === undefined
    ? null
    : text(body.description, 2000);
  const invoiceNotes = body.notes === null || body.notes === undefined
    ? null
    : text(body.notes, 2000);

  if (
    !customerName ||
    !validEmail(customerEmail) ||
    (customerEmailCc && !validEmail(customerEmailCc)) ||
    !dueDate ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)
  ) {
    res.status(400).json({ error: "Check the customer, email, and due date" });
    return;
  }

  try {
    const [saved] = await db
      .select({ invoice: wholesaleInvoicesTable, order: ordersTable })
      .from(wholesaleInvoicesTable)
      .innerJoin(ordersTable, eq(wholesaleInvoicesTable.orderId, ordersTable.id))
      .where(eq(wholesaleInvoicesTable.id, id))
      .limit(1);

    if (!saved) {
      res.status(404).json({ error: "Wholesale invoice not found" });
      return;
    }
    if (saved.invoice.paymentStatus === "paid") {
      res.status(409).json({ error: "Paid wholesale invoices cannot be edited" });
      return;
    }
    if (saved.invoice.paymentStatus === "creating") {
      res.status(409).json({ error: "This payment link is still being created. Try again in a moment." });
      return;
    }
    if (!saved.invoice.paymentUrl) {
      res.status(409).json({ error: "This invoice does not have a payment link yet" });
      return;
    }

    const { order, invoice } = await db.transaction(async (tx) => {
      const [updatedOrder] = await tx.update(ordersTable).set({
        customerName,
        customerEmail,
        updatedAt: new Date(),
      }).where(eq(ordersTable.id, saved.order.id)).returning();
      const [updatedInvoice] = await tx.update(wholesaleInvoicesTable).set({
        customerEmailCc,
        dueDate,
        description,
        invoiceNotes,
        emailStatus: "not_sent",
        emailLastError: null,
        updatedAt: new Date(),
      }).where(eq(wholesaleInvoicesTable.id, id)).returning();
      return { order: updatedOrder, invoice: updatedInvoice };
    });

    let warning: string | null = null;
    try {
      await sendSavedInvoice(invoice.id);
      await db.update(wholesaleInvoicesTable).set({
        emailStatus: "sent",
        invoiceSentAt: new Date(),
        emailLastError: null,
        updatedAt: new Date(),
      }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      invoice.emailStatus = "sent";
      invoice.invoiceSentAt = new Date();
    } catch (err) {
      warning = "Payment link updated, but the invoice email could not be sent. You can resend it from this page.";
      await db.update(wholesaleInvoicesTable).set({
        emailStatus: "failed",
        emailLastError: err instanceof Error ? err.message.slice(0, 500) : "Email failed",
        updatedAt: new Date(),
      }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      invoice.emailStatus = "failed";
    }

    res.json({ invoice: invoiceResponse(invoice, order), warning });
  } catch (err) {
    req.log.error({ err, invoiceId: id }, "Failed to update wholesale invoice");
    res.status(500).json({ error: "Failed to update wholesale invoice" });
  }
  });

  return router;
}

export default createWholesaleRouter();