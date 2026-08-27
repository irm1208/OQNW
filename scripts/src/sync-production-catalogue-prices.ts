import { db, pool, productsCatalogTable } from "@workspace/db";

type PriceChange = {
  slug: string;
  name: string;
  productionPriceGbp: number | null;
  cataloguePriceGbp: number | null;
};

type Preview = {
  sourceCount: number;
  productionCount: number;
  matchedCount: number;
  unchangedCount: number;
  changes: PriceChange[];
  sourceOnlySlugs: string[];
  productionOnlySlugs: string[];
  confirmationToken: string;
  confirmationExpiresAt: string;
};

function argumentValue(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function productionUrl(): string {
  const raw = argumentValue("production-url") ?? process.env.PRODUCTION_URL;
  if (!raw) {
    throw new Error("Pass the verified deployment URL with --production-url=https://… or PRODUCTION_URL");
  }
  const url = new URL(raw);
  if (url.protocol !== "https:") throw new Error("The production URL must use HTTPS");
  return url.toString().replace(/\/+$/, "");
}

function cookieHeader(response: Response): string {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] };
  const setCookies = headers.getSetCookie?.() ?? [];
  return setCookies.map((cookie) => cookie.split(";", 1)[0]).join("; ");
}

async function responseJson<T>(response: Response): Promise<T> {
  const data = await response.json() as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed with HTTP ${response.status}`);
  }
  return data;
}

function formatPrice(value: number | null): string {
  return value === null ? "—" : `£${value.toFixed(2)}`;
}

function printPreview(preview: Preview): void {
  console.log(`Matched ${preview.matchedCount} slug(s); ${preview.unchangedCount} already match.`);
  if (preview.changes.length === 0) {
    console.log("No production price changes are required.");
  } else {
    console.table(preview.changes.map((change) => ({
      slug: change.slug,
      production: formatPrice(change.productionPriceGbp),
      catalogue: formatPrice(change.cataloguePriceGbp),
    })));
    console.log(`Confirmation token: ${preview.confirmationToken}`);
  }
  if (preview.sourceOnlySlugs.length > 0) {
    console.log(`Development-only slugs (not created): ${preview.sourceOnlySlugs.join(", ")}`);
  }
  if (preview.productionOnlySlugs.length > 0) {
    console.log(`Production-only slugs (left untouched): ${preview.productionOnlySlugs.join(", ")}`);
  }
}

async function main(): Promise<void> {
  const baseUrl = productionUrl();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is required");

  const sourceRows = await db
    .select({
      slug: productsCatalogTable.slug,
      priceGbp: productsCatalogTable.priceGbp,
    })
    .from(productsCatalogTable)
    .orderBy(productsCatalogTable.slug);
  const prices = sourceRows.map((row) => ({
    slug: row.slug,
    priceGbp: row.priceGbp === null ? null : Number(row.priceGbp),
  }));

  const loginResponse = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password }),
  });
  await responseJson<{ authenticated: boolean }>(loginResponse);
  const cookie = cookieHeader(loginResponse);
  if (!cookie) throw new Error("Production login did not return a session cookie");

  const preview = await responseJson<Preview>(await fetch(
    `${baseUrl}/api/admin/catalog/price-sync/preview`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({ prices }),
    },
  ));
  printPreview(preview);

  const applyToken = argumentValue("apply");
  if (!applyToken) {
    if (preview.changes.length > 0) {
      console.log(
        `Dry run only. After reviewing the table, re-run with --apply=${preview.confirmationToken}`,
      );
    }
    return;
  }
  if (applyToken !== preview.confirmationToken) {
    throw new Error("The supplied --apply token does not match the fresh production diff");
  }
  if (preview.changes.length === 0) return;

  const result = await responseJson<{ updatedCount: number; updatedSlugs: string[] }>(await fetch(
    `${baseUrl}/api/admin/catalog/price-sync/apply`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({
        changes: preview.changes,
        confirmationToken: preview.confirmationToken,
      }),
    },
  ));
  console.log(`Updated ${result.updatedCount} production catalogue price(s).`);
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });