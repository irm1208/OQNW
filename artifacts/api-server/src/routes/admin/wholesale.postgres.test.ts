import assert from "node:assert/strict";
import crypto from "node:crypto";
import { randomUUID } from "node:crypto";
import type { AddressInfo } from "node:net";
import test from "node:test";
import express from "express";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import pg from "pg";
import { and, eq } from "drizzle-orm";

const { Pool } = pg;

test("wholesale creation and Wallid settlement are durable and idempotent", async (t) => {
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required");
  const schema = `wholesale_${randomUUID().replaceAll("-", "")}`;
  const bootstrap = new Pool({ connectionString: process.env.DATABASE_URL });
  let appPool: import("pg").Pool | undefined;
  let server: import("node:http").Server | undefined;
  const previousFetch = globalThis.fetch;
  const previousEnvironment = {
    DATABASE_URL: process.env.DATABASE_URL,
    WALLID_API_KEY_ID: process.env.WALLID_API_KEY_ID,
    WALLID_API_KEY_SECRET: process.env.WALLID_API_KEY_SECRET,
    WALLID_WEBHOOK_SECRET: process.env.WALLID_WEBHOOK_SECRET,
  };

  t.after(async () => {
    globalThis.fetch = previousFetch;
    for (const [key, value] of Object.entries(previousEnvironment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    if (server) await new Promise<void>((resolve, reject) => server!.close((e) => e ? reject(e) : resolve()));
    if (appPool) await appPool.end();
    await bootstrap.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await bootstrap.end();
  });

  await bootstrap.query(`CREATE SCHEMA "${schema}"`);
  await bootstrap.query(`
    CREATE TABLE "${schema}".admin_users (id serial primary key, email text unique not null, name text not null,
      password_hash text not null, role text not null default 'owner', is_active boolean not null default true,
      mfa_secret_encrypted text, pending_mfa_secret_encrypted text, mfa_enabled boolean not null default false,
      mfa_enrolled_at timestamptz, mfa_last_used_at timestamptz, session_version integer not null default 0,
      last_login_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
    CREATE TABLE "${schema}".products_catalog (id serial primary key, slug text unique not null, name text not null,
      category text not null, price_gbp numeric(10,2), short_description text, description text, image_url text,
      purity text, also_known_as text, molecular_weight text, cas_number text, formula text, sequence text, storage text,
      appearance text, solubility text, half_life text, seo_title text, seo_description text, is_published boolean not null default true,
      is_featured boolean not null default false, sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
    CREATE TABLE "${schema}".orders (id serial primary key, order_number text unique not null, status text not null default 'pending',
      customer_email text not null, customer_name text not null, customer_id integer, phone text, address1 text, address2 text, city text, county text, postcode text, country text,
      subtotal_gbp numeric(10,2) not null default 0, bundle_discount_gbp numeric(10,2) not null default 0, shipping_cost_gbp numeric(10,2) not null default 0, tax_amount_gbp numeric(10,2) not null default 0, total_gbp numeric(10,2) not null default 0,
      payment_currency text, payment_amount_minor integer, crypto_payment_status text not null default 'not_applicable', crypto_currency text, crypto_network text, crypto_wallet_address text, crypto_route_snapshot jsonb, crypto_expected_amount numeric(30,18), crypto_rate_usd numeric(30,10), crypto_rate_locked_at timestamptz, crypto_rate_expires_at timestamptz, crypto_payment_access_token text, crypto_tx_hash text, crypto_observed_amount numeric(30,18), crypto_confirmations integer, crypto_confirmed_at timestamptz, crypto_last_checked_at timestamptz, crypto_payment_reason text, refunded_amount_gbp numeric(10,2) not null default 0, refund_status text not null default 'none',
      shipping_method text, shipping_rate_id integer, carrier_name text, tracking_number text, tracking_url text, dispatched_at timestamptz, notes text, fraud_score integer not null default 0, fraud_flags text[] not null default '{}', fraud_reviewed boolean not null default false, fraud_review_note text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), review_request_sent_at timestamptz);
    CREATE TABLE "${schema}".order_items (id serial primary key, order_id integer not null references "${schema}".orders(id) on delete cascade, product_id integer not null, product_name text not null, product_category text not null, quantity integer not null default 1, price_gbp numeric(10,2) not null default 0, created_at timestamptz not null default now());
    CREATE TABLE "${schema}".wholesale_invoices (id serial primary key, order_id integer not null unique references "${schema}".orders(id) on delete cascade, reference_number text not null unique, customer_email_cc text, due_date date not null, description text, invoice_notes text, bank_account_label text not null default 'Wallid Business Account', payer_account_type text not null default 'any', payment_status text not null default 'creating', payment_last_error text, api_payment_id text unique, payment_url text, email_status text not null default 'not_sent', email_last_error text, invoice_sent_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
    CREATE FUNCTION "${schema}".reject_dbfail_ready() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        IF NEW.order_number = 'WS-DBFAIL' AND NEW.status = 'awaiting_payment' THEN
          RAISE EXCEPTION 'forced readiness failure';
        END IF;
        RETURN NEW;
      END
    $$;
    CREATE TRIGGER reject_dbfail_ready BEFORE UPDATE ON "${schema}".orders
      FOR EACH ROW EXECUTE FUNCTION "${schema}".reject_dbfail_ready();
  `);
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("options", `-c search_path=${schema}`);
  process.env.DATABASE_URL = url.toString();
  process.env.WALLID_API_KEY_ID = "test-id";
  process.env.WALLID_API_KEY_SECRET = "test-secret";
  process.env.WALLID_WEBHOOK_SECRET = "test-webhook-secret";

  const [{ db, pool, adminUsersTable, productsCatalogTable, orderItemsTable, ordersTable, wholesaleInvoicesTable }, auth, wholesale, webhook, reconciliation] = await Promise.all([
    import("@workspace/db"), import("./auth"), import("./wholesale"), import("../wallid-webhook"), import("../../lib/wallidReconciliationJob"),
  ]);
  appPool = pool;
  const [{ id: productId }] = await db.insert(productsCatalogTable).values({ slug: "wholesale-test", name: "Wholesale test", category: "Peptide", isPublished: true }).returning();
  await db.insert(adminUsersTable).values({ email: "owner@example.invalid", name: "Owner", passwordHash: "unused", role: "owner" });

  const invoiceEmails: string[] = [];
  const confirmations: string[] = [];
  const providerCreates = new Map<string, number>();
  const providerExpiry = new Map<string, string | undefined>();
  let emailFails = false;
  globalThis.fetch = async (input, init) => {
    const target = String(input);
    if (target.endsWith("/create")) {
      const request = JSON.parse(String(init?.body)) as { order_id: string; expires_at?: string };
      providerCreates.set(request.order_id, (providerCreates.get(request.order_id) ?? 0) + 1);
      providerExpiry.set(request.order_id, request.expires_at);
      if (request.order_id.includes("PROVIDERFAIL")) return new Response("failed", { status: 500 });
      if (request.order_id.includes("NETWORKFAIL")) throw new Error("simulated network failure");
      return Response.json({ api_payment_id: `pay-${request.order_id}`, payment_link: `https://pay.wallid.test/${request.order_id}` });
    }
    if (target.startsWith("http://127.0.0.1:")) return previousFetch(input, init);
    throw new Error(`Unexpected external request in wholesale integration test: ${target}`);
  };

  const app = express();
  app.use(pinoHttp({ level: "silent" }));
  app.use(cookieParser());
  app.use(express.json({ verify: (req: express.Request & { rawBody?: Buffer }, _res, body) => { req.rawBody = body; } }));
  app.use("/api/admin", auth.enforceSecureAdminSession);
  app.use("/api", wholesale.createWholesaleRouter({ sendInvoice: async ({ paymentUrl }) => { invoiceEmails.push(paymentUrl); if (emailFails) throw new Error("mail down"); } }));
  app.use("/api", webhook.createWallidWebhookRouter({ sendConfirmation: async ({ orderNumber }) => { confirmations.push(orderNumber); } }));
  server = app.listen(0);
  await new Promise<void>((resolve, reject) => { server!.once("listening", resolve); server!.once("error", reject); });
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
  const body = (referenceNumber: string) => ({ referenceNumber, customerName: "Buyer", customerEmail: "buyer@example.invalid", dueDate: "2030-01-01", items: [{ productId, quantity: 2, priceGbp: 12.5 }] });
  const makeSession = (stale = false) => {
    const now = Date.now; if (stale) Date.now = () => now() - 16 * 60_000;
    const value = auth.createSecureAdminSessionValue("owner@example.invalid"); Date.now = now; return value;
  };
  const post = (referenceNumber: string, cookie: string) => fetch(`${base}/admin/wholesale`, { method: "POST", headers: { "content-type": "application/json", origin: "http://127.0.0.1:5000", cookie: `admin_secure_session=${cookie}` }, body: JSON.stringify(body(referenceNumber)) });
  const retry = (id: number, cookie = makeSession()) => fetch(`${base}/admin/wholesale/${id}/retry`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1:5000", cookie: `admin_secure_session=${cookie}` },
  });
  const resolve = (id: number, apiPaymentId: string, paymentUrl: string, cookie = makeSession()) =>
    fetch(`${base}/admin/wholesale/${id}/resolve`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "http://127.0.0.1:5000",
        cookie: `admin_secure_session=${cookie}`,
      },
      body: JSON.stringify({ apiPaymentId, paymentUrl }),
    });

  const stale = await post("STALE", makeSession(true));
  assert.equal(stale.status, 401); assert.deepEqual(await stale.json(), { error: "Recent authentication required", requiresRecentAuth: true });
  const good = await post("GOOD", makeSession());
  assert.equal(good.status, 201);
  const goodJson = await good.json() as { invoice: { id: number; orderId: number; paymentUrl: string; }; warning: null };
  assert.equal(goodJson.warning, null);
  assert.equal(providerExpiry.get("WS-GOOD"), "2030-01-01T23:59:59.999Z");
  const [goodInvoice] = await db.select().from(wholesaleInvoicesTable).where(eq(wholesaleInvoicesTable.id, goodJson.invoice.id));
  const [goodOrder] = await db.select().from(ordersTable).where(eq(ordersTable.id, goodJson.invoice.orderId));
  assert.equal(goodInvoice.paymentUrl, "https://pay.wallid.test/WS-GOOD"); assert.equal(goodInvoice.apiPaymentId, "pay-WS-GOOD"); assert.match(goodOrder.notes ?? "", /pay-WS-GOOD/); assert.deepEqual(invoiceEmails, [goodInvoice.paymentUrl]);

  const createPersistedAttempt = async (referenceNumber: string, updatedAt: Date) => {
    const [order] = await db.insert(ordersTable).values({
      orderNumber: `WS-${referenceNumber}`,
      status: "pending",
      customerEmail: "persisted@example.invalid",
      customerName: "Persisted Buyer",
      subtotalGbp: "25.00",
      shippingCostGbp: "0.00",
      totalGbp: "25.00",
      paymentCurrency: "GBP",
      paymentAmountMinor: 2500,
      shippingMethod: "Wholesale",
      updatedAt,
    }).returning();
    await db.insert(orderItemsTable).values({
      orderId: order.id,
      productId,
      productName: "Persisted product name",
      productCategory: "Persisted category",
      quantity: 2,
      priceGbp: "12.50",
    });
    const [invoice] = await db.insert(wholesaleInvoicesTable).values({
      orderId: order.id,
      referenceNumber,
      dueDate: "2030-01-01",
      paymentStatus: "creating",
      updatedAt,
    }).returning();
    return { order, invoice };
  };

  const staleCreating = await createPersistedAttempt(
    "STALE-CREATING",
    new Date(Date.now() - wholesale.WHOLESALE_PAYMENT_CREATION_LEASE_MS - 1_000),
  );
  const staleEmailCount = invoiceEmails.length;
  const unauthenticatedRetry = await retry(staleCreating.invoice.id, makeSession(true));
  assert.equal(unauthenticatedRetry.status, 401);
  assert.deepEqual(await unauthenticatedRetry.json(), { error: "Recent authentication required", requiresRecentAuth: true });
  assert.equal(providerCreates.get("WS-STALE-CREATING") ?? 0, 0);
  const staleRetry = await retry(staleCreating.invoice.id);
  assert.equal(staleRetry.status, 409);
  assert.match((await staleRetry.json() as { error: string }).error, /inspect the Wallid dashboard/i);
  const [staleUnknownInvoice] = await db.select().from(wholesaleInvoicesTable).where(eq(wholesaleInvoicesTable.id, staleCreating.invoice.id));
  assert.equal(staleUnknownInvoice.paymentStatus, "unknown");
  assert.match(staleUnknownInvoice.paymentLastError ?? "", /manually attach/i);
  assert.equal(providerCreates.get("WS-STALE-CREATING") ?? 0, 0);
  assert.equal(invoiceEmails.length, staleEmailCount);

  const staleResolveUnauthenticated = await resolve(
    staleCreating.invoice.id,
    "pay-WS-STALE-CREATING",
    "https://pay.wallid.test/WS-STALE-CREATING",
    makeSession(true),
  );
  assert.equal(staleResolveUnauthenticated.status, 401);
  assert.deepEqual(await staleResolveUnauthenticated.json(), { error: "Recent authentication required", requiresRecentAuth: true });
  const staleResolved = await resolve(
    staleCreating.invoice.id,
    "pay-WS-STALE-CREATING",
    "https://pay.wallid.test/WS-STALE-CREATING",
  );
  assert.equal(staleResolved.status, 200);
  const [staleReadyInvoice] = await db.select().from(wholesaleInvoicesTable).where(eq(wholesaleInvoicesTable.id, staleCreating.invoice.id));
  const [staleReadyOrder] = await db.select().from(ordersTable).where(eq(ordersTable.id, staleCreating.order.id));
  assert.equal(providerCreates.get("WS-STALE-CREATING") ?? 0, 0);
  assert.equal(staleReadyInvoice.apiPaymentId, "pay-WS-STALE-CREATING");
  assert.equal(staleReadyInvoice.paymentUrl, "https://pay.wallid.test/WS-STALE-CREATING");
  assert.equal(staleReadyInvoice.paymentStatus, "ready");
  assert.equal(staleReadyOrder.status, "awaiting_payment");
  assert.equal(invoiceEmails.length, staleEmailCount + 1);
  assert.equal(invoiceEmails.at(-1), staleReadyInvoice.paymentUrl);

  const freshCreating = await createPersistedAttempt("FRESH-CREATING", new Date());
  const freshEmailCount = invoiceEmails.length;
  const freshRetry = await retry(freshCreating.invoice.id);
  assert.equal(freshRetry.status, 409);
  assert.match((await freshRetry.json() as { error: string }).error, /already being created/i);
  assert.equal(providerCreates.get("WS-FRESH-CREATING"), undefined);
  assert.equal(invoiceEmails.length, freshEmailCount);

  const providerFailure = await post("PROVIDERFAIL", makeSession());
  assert.equal(providerFailure.status, 502);
  assert.match((await providerFailure.json() as { error: string }).error, /result is unknown/i);
  const [failedInvoice] = await db.select().from(wholesaleInvoicesTable).where(eq(wholesaleInvoicesTable.referenceNumber, "PROVIDERFAIL"));
  assert.equal(failedInvoice.paymentStatus, "unknown"); assert.match(failedInvoice.paymentLastError ?? "", /Wallid/);
  const providerFailureEmailCount = invoiceEmails.length;
  const retryProviderFailure = await retry(failedInvoice.id);
  assert.equal(retryProviderFailure.status, 409);
  const [retriedFailedInvoice] = await db.select().from(wholesaleInvoicesTable).where(eq(wholesaleInvoicesTable.id, failedInvoice.id));
  assert.equal(providerCreates.get("WS-PROVIDERFAIL"), 1);
  assert.equal(retriedFailedInvoice.paymentStatus, "unknown");
  assert.match(retriedFailedInvoice.paymentLastError ?? "", /Wallid/);
  assert.equal(invoiceEmails.length, providerFailureEmailCount);
  const invalidResolve = await resolve(failedInvoice.id, "manual-provider-fail", "http://pay.wallid.test/not-secure");
  assert.equal(invalidResolve.status, 400);
  const duplicateResolve = await resolve(failedInvoice.id, goodInvoice.apiPaymentId!, "https://pay.wallid.test/duplicate");
  assert.equal(duplicateResolve.status, 409);
  assert.match((await duplicateResolve.json() as { error: string }).error, /already attached/i);
  assert.equal(providerCreates.get("WS-PROVIDERFAIL"), 1);

  const networkFailure = await post("NETWORKFAIL", makeSession());
  assert.equal(networkFailure.status, 502);
  const [networkUnknownInvoice] = await db.select().from(wholesaleInvoicesTable)
    .where(eq(wholesaleInvoicesTable.referenceNumber, "NETWORKFAIL"));
  assert.equal(networkUnknownInvoice.paymentStatus, "unknown");
  const networkRetry = await retry(networkUnknownInvoice.id);
  assert.equal(networkRetry.status, 409);
  assert.equal(providerCreates.get("WS-NETWORKFAIL"), 1);
  const localFailure = await post("DBFAIL", makeSession());
  assert.equal(localFailure.status, 502);
  assert.match((await localFailure.json() as { error: string }).error, /could not be made ready/i);
  const [localFailedInvoice] = await db.select().from(wholesaleInvoicesTable).where(eq(wholesaleInvoicesTable.referenceNumber, "DBFAIL"));
  const [localFailedOrder] = await db.select().from(ordersTable).where(eq(ordersTable.id, localFailedInvoice.orderId));
  assert.equal(localFailedInvoice.paymentStatus, "failed");
  assert.equal(localFailedInvoice.apiPaymentId, "pay-WS-DBFAIL");
  assert.equal(localFailedInvoice.paymentUrl, "https://pay.wallid.test/WS-DBFAIL");
  assert.equal(localFailedOrder.status, "pending");
  const repairEmailCount = invoiceEmails.length;
  await bootstrap.query(`DROP TRIGGER reject_dbfail_ready ON "${schema}".orders`);
  const repaired = await retry(localFailedInvoice.id);
  assert.equal(repaired.status, 200);
  assert.equal((await repaired.json() as { warning: null }).warning, null);
  const [repairedInvoice] = await db.select().from(wholesaleInvoicesTable).where(eq(wholesaleInvoicesTable.id, localFailedInvoice.id));
  const [repairedOrder] = await db.select().from(ordersTable).where(eq(ordersTable.id, localFailedOrder.id));
  assert.equal(providerCreates.get("WS-DBFAIL"), 1);
  assert.equal(repairedInvoice.apiPaymentId, localFailedInvoice.apiPaymentId);
  assert.equal(repairedInvoice.paymentUrl, localFailedInvoice.paymentUrl);
  assert.equal(repairedInvoice.paymentStatus, "ready");
  assert.equal(repairedOrder.status, "awaiting_payment");
  assert.equal(invoiceEmails.length, repairEmailCount + 1);
  assert.equal(invoiceEmails.at(-1), repairedInvoice.paymentUrl);
  emailFails = true;
  const emailFailure = await post("EMAILFAIL", makeSession());
  assert.equal(emailFailure.status, 201);
  const emailJson = await emailFailure.json() as { warning: string };
  assert.match(emailJson.warning, /email could not be sent/i);
  const [emailInvoice] = await db.select().from(wholesaleInvoicesTable).where(eq(wholesaleInvoicesTable.referenceNumber, "EMAILFAIL"));
  assert.equal(emailInvoice.emailStatus, "failed"); emailFails = false;

  const webhookBody = JSON.stringify({ events: [{ event_id: "evt-good", api_payment_id: goodInvoice.apiPaymentId, order_id: goodOrder.orderNumber, status: "SUCCESS", amount: 2500, currency: "GBP", occurred_at: new Date().toISOString() }] });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = `sha256=${crypto.createHmac("sha256", process.env.WALLID_WEBHOOK_SECRET!).update(`${timestamp}.${webhookBody}`).digest("hex")}`;
  const webhookRequest = () => fetch(`${base}/wallid-webhook`, { method: "POST", headers: { "content-type": "application/json", "x-webhook-timestamp": timestamp, "x-webhook-signature": signature }, body: webhookBody });
  const [settlementResponse, repeatedCreateResponse] = await Promise.all([
    webhookRequest(),
    post("GOOD", makeSession()),
  ]);
  assert.equal(settlementResponse.status, 200);
  assert.equal(repeatedCreateResponse.status, 200);
  assert.equal((await repeatedCreateResponse.json() as { invoice: { paymentStatus: string; status: string } }).invoice.paymentStatus, "paid");
  const duplicateWebhookResponse = await webhookRequest();
  assert.equal(duplicateWebhookResponse.status, 200);
  const [paidOrder] = await db.select().from(ordersTable).where(eq(ordersTable.id, goodOrder.id));
  const [paidInvoice] = await db.select().from(wholesaleInvoicesTable).where(eq(wholesaleInvoicesTable.id, goodInvoice.id));
  assert.equal(paidOrder.status, "paid"); assert.equal(paidInvoice.paymentStatus, "paid"); assert.deepEqual(confirmations, [goodOrder.orderNumber]);
  const paidProviderCalls = providerCreates.get(goodOrder.orderNumber);
  const paidEmailCount = invoiceEmails.length;
  const paidRetry = await retry(paidInvoice.id);
  assert.equal(paidRetry.status, 409);
  assert.match((await paidRetry.json() as { error: string }).error, /paid/i);
  assert.equal(providerCreates.get(goodOrder.orderNumber), paidProviderCalls);
  assert.equal(invoiceEmails.length, paidEmailCount);

  const second = await post("RECONCILE", makeSession()); assert.equal(second.status, 201);
  const secondJson = await second.json() as { invoice: { orderId: number } };
  const [secondOrder] = await db.select().from(ordersTable).where(eq(ordersTable.id, secondJson.invoice.orderId));
  const firstRun = await reconciliation.reconcilePendingWallidPaymentsWith({ checkPaymentStatus: async (id) => ({ api_payment_id: id, order_id: secondOrder.orderNumber, status: "SUCCESS", amount: 2500, currency: "GBP" }), sendConfirmation: async ({ orderNumber }) => { confirmations.push(orderNumber); } });
  const duplicateRun = await reconciliation.reconcilePendingWallidPaymentsWith({ checkPaymentStatus: async () => ({ api_payment_id: "unsettled", order_id: "unsettled", status: "PENDING", amount: 0, currency: "GBP" }), sendConfirmation: async () => { throw new Error("must not resend"); } });
  assert.equal(firstRun.settled, 1); assert.equal(duplicateRun.settled, 0);
  assert.equal(confirmations.filter((id) => id === secondOrder.orderNumber).length, 1);
  const [reconciledInvoice] = await db.select().from(wholesaleInvoicesTable).where(eq(wholesaleInvoicesTable.orderId, secondOrder.id));
  assert.equal(reconciledInvoice.paymentStatus, "paid");
});