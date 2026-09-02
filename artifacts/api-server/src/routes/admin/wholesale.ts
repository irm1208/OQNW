import { Router, type Request, type Response } from "express";
import {
  db,
  orderItemsTable,
  ordersTable,
  productsCatalogTable,
  wholesaleInvoicesTable,
} from "@workspace/db";
import { and, desc, eq, inArray } from "drizzle-orm";
import { createWallidPayment } from "../../lib/wallid";
import { sendWholesaleInvoice } from "../../lib/email";

const router = Router();
const SITE_URL = process.env.SITE_URL ?? "https://omniqure.com";

type CreateBody = {
  referenceNumber?: unknown;
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

function text(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function validEmail(value: string | null): value is string {
  return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
    customerEmailCc: invoice.customerEmailCc,
    dueDate: invoice.dueDate,
    description: invoice.description,
    totalGbp: Number(order.totalGbp),
    paymentUrl: invoice.paymentUrl,
    paymentStatus: invoice.paymentStatus,
    emailStatus: invoice.emailStatus,
    invoiceSentAt: invoice.invoiceSentAt?.toISOString() ?? null,
    createdAt: invoice.createdAt.toISOString(),
  };
}

async function sendSavedInvoice(invoiceId: number): Promise<void> {
  const [row] = await db
    .select({ invoice: wholesaleInvoicesTable, order: ordersTable })
    .from(wholesaleInvoicesTable)
    .innerJoin(ordersTable, eq(wholesaleInvoicesTable.orderId, ordersTable.id))
    .where(eq(wholesaleInvoicesTable.id, invoiceId))
    .limit(1);
  if (!row?.invoice.paymentUrl) throw new Error("Payment link is not ready");
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, row.order.id));
  await sendWholesaleInvoice({
    referenceNumber: row.invoice.referenceNumber,
    dueDate: row.invoice.dueDate,
    paymentUrl: row.invoice.paymentUrl,
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
  const dueDate = text(body.dueDate, 10);
  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (
    !referenceNumber || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(referenceNumber) ||
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
  const shippingCost = Number(body.shippingCostGbp ?? 0);
  if (!Number.isFinite(shippingCost) || shippingCost < 0 || shippingCost > 1_000_000) {
    res.status(400).json({ error: "Shipping cost is invalid" });
    return;
  }
  const subtotal = items.reduce((sum, item) => sum + item.priceGbp * item.quantity, 0);
  const total = Math.round((subtotal + shippingCost) * 100) / 100;
  const amountMinor = Math.round(total * 100);
  const orderNumber = `WS-${referenceNumber}`;

  try {
    const created = await db.transaction(async (tx) => {
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
        paymentCurrency: "GBP",
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

    const payment = await createWallidPayment({
      orderNumber,
      amountMinor,
      currency: "GBP",
      customerEmail,
      customerId: `wholesale-${created.order.id}`,
      successUrl: `${SITE_URL}/wallid-return?order=${encodeURIComponent(orderNumber)}&status=success`,
      failUrl: `${SITE_URL}/wallid-return?order=${encodeURIComponent(orderNumber)}&status=failed`,
      items: items.map((item) => {
        const product = productById.get(item.productId)!;
        return {
          name: `${product.name} x ${item.quantity}`,
          category: product.category,
          price_minor: Math.round(item.priceGbp * item.quantity * 100),
          image_url: product.imageUrl ?? "",
          product_url: `${SITE_URL}/product/${product.slug}`,
        };
      }),
    });
    if (!payment) {
      await db.update(wholesaleInvoicesTable).set({ paymentStatus: "failed" }).where(eq(wholesaleInvoicesTable.id, created.invoice.id));
      res.status(502).json({ error: "The order was saved, but Wallid could not create the payment link", orderId: created.order.id });
      return;
    }

    const [invoice] = await db.update(wholesaleInvoicesTable).set({
      paymentStatus: "ready",
      apiPaymentId: payment.apiPaymentId,
      paymentUrl: payment.paymentUrl,
    }).where(eq(wholesaleInvoicesTable.id, created.invoice.id)).returning();
    const [order] = await db.update(ordersTable).set({
      status: "awaiting_payment",
      notes: `${created.order.notes ?? ""}\nWallid payment id: ${payment.apiPaymentId}`.trim(),
    }).where(eq(ordersTable.id, created.order.id)).returning();

    let warning: string | null = null;
    try {
      await sendSavedInvoice(invoice.id);
      await db.update(wholesaleInvoicesTable).set({ emailStatus: "sent", invoiceSentAt: new Date(), emailLastError: null }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      invoice.emailStatus = "sent";
      invoice.invoiceSentAt = new Date();
    } catch (err) {
      warning = "Payment link created, but the invoice email could not be sent. You can resend it from this page.";
      await db.update(wholesaleInvoicesTable).set({ emailStatus: "failed", emailLastError: err instanceof Error ? err.message.slice(0, 500) : "Email failed" }).where(eq(wholesaleInvoicesTable.id, invoice.id));
      invoice.emailStatus = "failed";
    }
    res.status(201).json({ invoice: invoiceResponse(invoice, order), warning });
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "23505") {
      res.status(409).json({ error: "That reference number has already been used" });
      return;
    }
    req.log.error({ err }, "Failed to create wholesale invoice");
    res.status(500).json({ error: "Failed to create wholesale invoice" });
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
    await db.update(wholesaleInvoicesTable).set({ emailStatus: "sent", invoiceSentAt: new Date(), emailLastError: null }).where(eq(wholesaleInvoicesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    await db.update(wholesaleInvoicesTable).set({ emailStatus: "failed", emailLastError: err instanceof Error ? err.message.slice(0, 500) : "Email failed" }).where(eq(wholesaleInvoicesTable.id, id));
    res.status(502).json({ error: "Invoice email could not be sent" });
  }
});

export default router;