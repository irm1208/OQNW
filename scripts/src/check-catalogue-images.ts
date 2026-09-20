import { readFile } from "node:fs/promises";

type CatalogueProduct = {
  slug: string;
  name: string;
  imageUrl: string | null;
};

type ImageOverrideMap = Record<string, string>;

const baseUrl = (process.env.CATALOGUE_IMAGE_CHECK_BASE_URL ?? "http://127.0.0.1:8080").replace(/\/+$/, "");
const overridesUrl = new URL("../../artifacts/omniqure/src/data/catalogueImageOverrides.json", import.meta.url);

function toProtectedImagePath(imageUrl: string): string {
  if (/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith("/api/")) return imageUrl;
  return `/api/catalogue-assets${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

async function readOverrides(): Promise<ImageOverrideMap> {
  const raw = await readFile(overridesUrl, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Catalogue image overrides must be a JSON object.");
  }
  return parsed as ImageOverrideMap;
}

async function readProducts(): Promise<CatalogueProduct[]> {
  const response = await fetch(`${baseUrl}/api/products`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Catalogue API returned HTTP ${response.status} for /api/products.`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Catalogue API returned a non-array product payload.");
  }

  return payload.map((product, index) => {
    if (!product || typeof product !== "object") {
      throw new Error(`Catalogue API product ${index + 1} is not an object.`);
    }
    const candidate = product as Record<string, unknown>;
    if (typeof candidate.slug !== "string" || typeof candidate.name !== "string") {
      throw new Error(`Catalogue API product ${index + 1} is missing slug or name.`);
    }
    if (candidate.imageUrl !== null && typeof candidate.imageUrl !== "string") {
      throw new Error(`Catalogue API product ${candidate.slug} has an invalid imageUrl.`);
    }
    return {
      slug: candidate.slug,
      name: candidate.name,
      imageUrl: candidate.imageUrl,
    };
  });
}

async function checkImage(product: CatalogueProduct, overrides: ImageOverrideMap) {
  const source = overrides[product.slug] ?? product.imageUrl;
  if (!source) {
    return { product, error: "has no image URL" };
  }

  const path = toProtectedImagePath(source);
  const url = /^https?:\/\//i.test(path) ? path : `${baseUrl}${path}`;

  try {
    const response = await fetch(url, {
      headers: { accept: "image/*" },
      redirect: "manual",
    });
    const contentType = response.headers.get("content-type") ?? "";
    await response.body?.cancel();

    if (!response.ok) {
      return { product, path, error: `returned HTTP ${response.status}` };
    }
    if (!contentType.toLowerCase().startsWith("image/")) {
      return { product, path, error: `returned ${contentType || "no content type"} instead of an image` };
    }
    return null;
  } catch (error) {
    return {
      product,
      path,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const [overrides, products] = await Promise.all([readOverrides(), readProducts()]);
  const failures: Array<{ product: CatalogueProduct; path?: string; error: string }> = [];

  for (let index = 0; index < products.length; index += 12) {
    const batch = products.slice(index, index + 12);
    const results = await Promise.all(batch.map(product => checkImage(product, overrides)));
    failures.push(...results.filter((result): result is NonNullable<typeof result> => result !== null));
  }

  if (failures.length > 0) {
    console.error(`Catalogue image check failed for ${failures.length} of ${products.length} products:`);
    for (const failure of failures) {
      console.error(`- ${failure.product.name} (${failure.product.slug}): ${failure.error}${failure.path ? ` [${failure.path}]` : ""}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Catalogue image check passed: ${products.length} product image URLs returned image content from ${baseUrl}.`);
}

await main();