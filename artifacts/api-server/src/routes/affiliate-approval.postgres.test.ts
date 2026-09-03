import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { AddressInfo } from "node:net";
import test from "node:test";
import pg from "pg";
import { eq } from "drizzle-orm";

const { Pool } = pg;

test("affiliate approval gates dashboard, rewards, and checkout discounts", async (t) => {
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required");

  const originalDatabaseUrl = process.env.DATABASE_URL;
  const schema = `affiliate_gate_${randomUUID().replaceAll("-", "")}`;
  const bootstrapPool = new Pool({ connectionString: originalDatabaseUrl });
  let appPool: import("pg").Pool | undefined;
  let server: import("node:http").Server | undefined;

  t.after(async () => {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => error ? reject(error) : resolve());
      });
    }
    if (appPool) await appPool.end();
    await bootstrapPool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await bootstrapPool.end();
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  await bootstrapPool.query(`CREATE SCHEMA "${schema}"`);
  const baseTables = [
    "admin_users",
    "admin_audit_events",
    "customers",
    "orders",
    "products_catalog",
    "products_inventory",
    "discount_codes",
    "loyalty_transactions",
    "inventory_audit_log",
    "referral_rewards",
    "referral_redemption_allocations",
  ];
  for (const table of baseTables) {
    await bootstrapPool.query(
      `CREATE TABLE "${schema}"."${table}" (LIKE public."${table}" INCLUDING DEFAULTS)`,
    );
  }
  await bootstrapPool.query(`
    ALTER TABLE "${schema}".customers
      ADD PRIMARY KEY (id),
      ADD CONSTRAINT customers_email_unique UNIQUE (email);
    ALTER TABLE "${schema}".orders
      ADD PRIMARY KEY (id);
    ALTER TABLE "${schema}".products_catalog
      ADD PRIMARY KEY (id),
      ADD CONSTRAINT products_catalog_slug_unique UNIQUE (slug);
    ALTER TABLE "${schema}".discount_codes
      ADD PRIMARY KEY (id),
      ADD CONSTRAINT discount_codes_code_unique UNIQUE (code);
    ALTER TABLE "${schema}".admin_users
      ADD PRIMARY KEY (id),
      ADD CONSTRAINT admin_users_email_unique UNIQUE (email);
  `);

  const schemaUrl = new URL(originalDatabaseUrl);
  schemaUrl.searchParams.set("options", `-c search_path=${schema}`);
  process.env.DATABASE_URL = schemaUrl.toString();
  const migrationClient = await bootstrapPool.connect();
  try {
    await migrationClient.query(`SET search_path TO "${schema}"`);
    for (const migration of ["0005_affiliate_program.sql", "0006_affiliate_customer_flow.sql"]) {
      const path = fileURLToPath(new URL(`../../../../lib/db/migrations/${migration}`, import.meta.url));
      await migrationClient.query(readFileSync(path, "utf8"));
    }
  } finally {
    migrationClient.release();
  }

  const [{ db, pool, affiliatePartnersTable, affiliateRewardCreditsTable, customersTable,
    discountCodesTable, productsCatalogTable, adminUsersTable }, { default: app }, auth] = await Promise.all([
    import("@workspace/db"),
    import("../app"),
    import("./admin/auth"),
  ]);
  appPool = pool;

  const customers = await db.insert(customersTable).values([
    { email: "pending@example.invalid", firstName: "Pending", lastName: "Partner" },
    { email: "rejected@example.invalid", firstName: "Rejected", lastName: "Partner" },
    { email: "suspended@example.invalid", firstName: "Suspended", lastName: "Partner" },
  ]).returning({ id: customersTable.id, email: customersTable.email });
  const customerIdByEmail = new Map(customers.map((customer) => [customer.email, customer.id]));

  const partners = await db.insert(affiliatePartnersTable).values([
    {
      customerId: customerIdByEmail.get("pending@example.invalid")!,
      name: "Pending Partner",
      email: "pending@example.invalid",
      trackingCode: "PENDING-TRACK",
      discountCode: "PENDING10",
      status: "pending",
    },
    {
      customerId: customerIdByEmail.get("rejected@example.invalid")!,
      name: "Rejected Partner",
      email: "rejected@example.invalid",
      trackingCode: "REJECTED-TRACK",
      discountCode: "REJECTED10",
      status: "rejected",
    },
    {
      customerId: customerIdByEmail.get("suspended@example.invalid")!,
      name: "Suspended Partner",
      email: "suspended@example.invalid",
      trackingCode: "SUSPENDED-TRACK",
      discountCode: "SUSPENDED10",
      status: "suspended",
    },
  ]).returning({
    id: affiliatePartnersTable.id,
    email: affiliatePartnersTable.email,
    discountCode: affiliatePartnersTable.discountCode,
  });

  await db.insert(discountCodesTable).values(partners.map((partner) => ({
    code: partner.discountCode,
    affiliatePartnerId: partner.id,
    type: "percentage",
    value: "10",
    // Keep these active deliberately: the checkout route must enforce the
    // affiliate partner status independently of the discount-row flag.
    isActive: true,
  })));
  await db.insert(productsCatalogTable).values({
    slug: "approval-test-peptide",
    name: "Approval Test Peptide",
    category: "Peptides",
    priceGbp: "25.00",
    isPublished: true,
  });
  const product = (await db.select({ id: productsCatalogTable.id })
    .from(productsCatalogTable)
    .where(eq(productsCatalogTable.slug, "approval-test-peptide"))
    .limit(1))[0];
  assert.ok(product);

  const rewards = await db.insert(affiliateRewardCreditsTable).values(partners.map((partner) => ({
    partnerId: partner.id,
    qualifyingSalesGbp: "1000.00",
    creditValueGbp: "50.00",
    status: "available",
  }))).returning({
    id: affiliateRewardCreditsTable.id,
    partnerId: affiliateRewardCreditsTable.partnerId,
  });
  const rewardIdByPartner = new Map(rewards.map((reward) => [reward.partnerId, reward.id]));

  await db.insert(adminUsersTable).values({
    email: "affiliate-test-admin@example.invalid",
    name: "Affiliate Test Admin",
    passwordHash: "unused",
    role: "owner",
    isActive: true,
  });

  server = app.listen(0);
  await new Promise<void>((resolve, reject) => {
    server!.once("listening", resolve);
    server!.once("error", reject);
  });
  const base = `http://127.0.0.1:${(server!.address() as AddressInfo).port}/api`;
  const sessionSecret = process.env.SESSION_SECRET ?? "omniqure-cust-session-development-only";
  const customerCookie = (customerId: number) => {
    const payload = String(customerId);
    return `customer_session=${payload}.${createHmac("sha256", sessionSecret).update(payload).digest("hex")}`;
  };
  const adminCookie = `admin_secure_session=${auth.createSecureAdminSessionValue("affiliate-test-admin@example.invalid")}`;
  const getMe = (customerId: number) => fetch(`${base}/affiliates/me`, {
    headers: { cookie: customerCookie(customerId) },
  });
  const claimReward = (customerId: number, rewardId: number) => fetch(`${base}/affiliates/rewards/${rewardId}/claim`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: customerCookie(customerId),
      origin: "http://127.0.0.1:5000",
    },
    body: JSON.stringify({ productSlug: "approval-test-peptide" }),
  });
  const updatePartner = (partnerId: number, status: string) => fetch(`${base}/admin/affiliates/partners/${partnerId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      cookie: adminCookie,
      origin: "http://127.0.0.1:5000",
    },
    body: JSON.stringify({ status }),
  });
  const quote = (discountCode: string) => fetch(`${base}/orders/quote`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1:5000" },
    body: JSON.stringify({
      delivery: {
        email: "shopper@example.invalid",
        firstName: "Checkout",
        lastName: "Shopper",
        address1: "1 Test Street",
        city: "London",
        postcode: "SW1A 1AA",
        country: "United Kingdom",
      },
      shippingMethod: "Standard",
      items: [{
        productId: 99999,
        productSlug: "approval-test-peptide",
        productName: "Client-supplied name",
        productCategory: "Peptides",
        quantity: 1,
        priceGbp: 999,
      }],
      discountCode,
      paymentMethod: "wallid",
      paymentCurrency: "GBP",
    }),
  });

  const restrictedStatuses = ["pending", "rejected", "suspended"] as const;
  for (const status of restrictedStatuses) {
    const partner = partners.find((candidate) => candidate.email === `${status}@example.invalid`)!;
    const customerId = customerIdByEmail.get(partner.email)!;
    const meResponse = await getMe(customerId);
    assert.equal(meResponse.status, 200);
    const me = await meResponse.json() as { partner: Record<string, unknown> };
    assert.equal(me.partner.status, status);
    assert.equal("trackingCode" in me.partner, false, `${status} partner must not receive a tracking code`);
    assert.equal("discountCode" in me.partner, false, `${status} partner must not receive a discount code`);
    assert.equal("rewards" in me, false, `${status} partner must not receive rewards`);
    assert.equal("eligibleProducts" in me, false, `${status} partner must not receive eligible products`);

    const claimResponse = await claimReward(customerId, rewardIdByPartner.get(partner.id)!);
    assert.equal(claimResponse.status, 403);
    assert.deepEqual(await claimResponse.json(), {
      error: "Affiliate rewards are available only after admin approval",
    });

    const restrictedQuoteResponse = await quote(partner.discountCode);
    assert.equal(restrictedQuoteResponse.status, 200);
    const restrictedQuote = await restrictedQuoteResponse.json() as { discountAmountGbp: number };
    assert.equal(
      restrictedQuote.discountAmountGbp,
      0,
      `${status} partner discount must be rejected even when its discount row is active`,
    );
  }

  const pendingPartner = partners.find((partner) => partner.email === "pending@example.invalid")!;
  const pendingCustomerId = customerIdByEmail.get(pendingPartner.email)!;
  const approveResponse = await updatePartner(pendingPartner.id, "approved");
  assert.equal(approveResponse.status, 200);
  const approvedMeResponse = await getMe(pendingCustomerId);
  assert.equal(approvedMeResponse.status, 200);
  const approvedMe = await approvedMeResponse.json() as {
    partner: { status: string; trackingCode: string; discountCode: string };
    rewards: unknown[];
    eligibleProducts: Array<{ slug: string }>;
  };
  assert.equal(approvedMe.partner.status, "approved");
  assert.equal(approvedMe.partner.trackingCode, "PENDING-TRACK");
  assert.equal(approvedMe.partner.discountCode, "PENDING10");
  assert.equal(approvedMe.rewards.length, 1);
  assert.deepEqual(approvedMe.eligibleProducts.map((product) => product.slug), ["approval-test-peptide"]);

  const approvedClaimResponse = await claimReward(pendingCustomerId, rewardIdByPartner.get(pendingPartner.id)!);
  assert.equal(approvedClaimResponse.status, 200);
  assert.deepEqual(await approvedClaimResponse.json(), {
    claimed: true,
    rewardId: rewardIdByPartner.get(pendingPartner.id),
    productName: "Approval Test Peptide",
  });

  const approvedQuoteResponse = await quote("PENDING10");
  assert.equal(approvedQuoteResponse.status, 200);
  const approvedQuote = await approvedQuoteResponse.json() as { discountAmountGbp: number };
  assert.equal(approvedQuote.discountAmountGbp, 2.5);

  const suspendResponse = await updatePartner(pendingPartner.id, "suspended");
  assert.equal(suspendResponse.status, 200);
  const suspendedMeResponse = await getMe(pendingCustomerId);
  assert.equal(suspendedMeResponse.status, 200);
  const suspendedMe = await suspendedMeResponse.json() as { partner: Record<string, unknown> };
  assert.equal(suspendedMe.partner.status, "suspended");
  assert.equal("trackingCode" in suspendedMe.partner, false);
  assert.equal("discountCode" in suspendedMe.partner, false);

  const suspendedQuoteResponse = await quote("PENDING10");
  assert.equal(suspendedQuoteResponse.status, 200);
  const suspendedQuote = await suspendedQuoteResponse.json() as { discountAmountGbp: number };
  assert.equal(suspendedQuote.discountAmountGbp, 0);

  const [discount] = await db.select({ isActive: discountCodesTable.isActive })
    .from(discountCodesTable)
    .where(eq(discountCodesTable.code, "PENDING10"));
  assert.equal(discount?.isActive, false);
});