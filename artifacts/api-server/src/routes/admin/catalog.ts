import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { productsCatalogTable, productsInventoryTable } from "@workspace/db";
import { eq, ilike, and, ne, notInArray, isNull } from "drizzle-orm";
import { seedProductsCatalog } from "../../lib/seed-catalog";
import { hasJanoshikReport, JANOSHIK_REPORTED_PRODUCT_SLUGS } from "../../lib/janoshikReports";
import {
  isRetiredProductSlug,
  RETIRED_PRODUCT_SLUGS,
  retireRemovedProducts,
} from "../../lib/retiredProducts";
import {
  buildCatalogPricePreview,
  CatalogPriceInputError,
  createPriceSyncConfirmationToken,
  parseApprovedPriceChanges,
  parseCataloguePrices,
  verifyPriceSyncConfirmationToken,
} from "../../lib/catalogPriceSync";
import { hasSecureAdminSession } from "./auth";
import {
  toCanonicalCatalogueImageUrl,
  toPublicCatalogueImageUrl,
} from "../../lib/catalogueAssetUrls";

const router = Router();
const PRICE_SYNC_CONFIRMATION_TTL_MS = 10 * 60 * 1000;

function strictRequestBody(
  value: unknown,
  allowedKeys: readonly string[],
): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new CatalogPriceInputError("Request body must be an object");
  }
  const body = value as Record<string, unknown>;
  const unknown = Object.keys(body).filter((key) => !allowedKeys.includes(key));
  if (unknown.length > 0) {
    throw new CatalogPriceInputError(`Request contains unsupported fields: ${unknown.join(", ")}`);
  }
  return body;
}

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function requireSecureAdmin(req: Request, res: Response): boolean {
  if (!hasSecureAdminSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function priceSyncSecret(res: Response): string | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    res.status(503).json({ error: "Price sync is unavailable because secure session signing is not configured" });
    return null;
  }
  return secret;
}

function catalogToResponse(p: typeof productsCatalogTable.$inferSelect) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    priceGbp: p.priceGbp !== null ? Number(p.priceGbp) : null,
    shortDescription: p.shortDescription ?? null,
    description: p.description ?? null,
    imageUrl: p.imageUrl ?? null,
    purity: p.purity ?? null,
    alsoKnownAs: p.alsoKnownAs ?? null,
    molecularWeight: p.molecularWeight ?? null,
    casNumber: p.casNumber ?? null,
    formula: p.formula ?? null,
    sequence: p.sequence ?? null,
    storage: p.storage ?? null,
    appearance: p.appearance ?? null,
    solubility: p.solubility ?? null,
    halfLife: p.halfLife ?? null,
    seoTitle: p.seoTitle ?? null,
    seoDescription: p.seoDescription ?? null,
    hasJanoshikReport: hasJanoshikReport(p.slug),
    isPublished: p.isPublished,
    isFeatured: p.isFeatured,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

async function syncInventoryProduct(product: typeof productsCatalogTable.$inferSelect) {
  await db
    .insert(productsInventoryTable)
    .values({
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
      productImage: product.imageUrl,
    })
    .onConflictDoUpdate({
      target: productsInventoryTable.productId,
      set: {
        productName: product.name,
        productCategory: product.category,
        productImage: product.imageUrl,
      },
    });
}

type ProductBody = {
  slug?: unknown;
  name?: unknown;
  category?: unknown;
  priceGbp?: unknown;
  shortDescription?: unknown;
  description?: unknown;
  imageUrl?: unknown;
  purity?: unknown;
  alsoKnownAs?: unknown;
  molecularWeight?: unknown;
  casNumber?: unknown;
  formula?: unknown;
  sequence?: unknown;
  storage?: unknown;
  appearance?: unknown;
  solubility?: unknown;
  halfLife?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
  isPublished?: unknown;
  isFeatured?: unknown;
  sortOrder?: unknown;
};

function isStr(v: unknown): v is string { return typeof v === "string"; }
function isNum(v: unknown): v is number { return typeof v === "number" && !isNaN(v); }
function isBool(v: unknown): v is boolean { return typeof v === "boolean"; }
function strOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  return isStr(v) ? v : null;
}

// Ensure DB is seeded on first request
let seeded = false;
async function ensureSeeded() {
  if (!seeded) {
    await seedProductsCatalog();
    await retireRemovedProducts();
    seeded = true;
  }
}

// GET /api/admin/catalog
router.get("/admin/catalog", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureSeeded();
    const search = isStr(req.query.search) ? req.query.search : undefined;
    const category = isStr(req.query.category) ? req.query.category : undefined;
    const published = req.query.published;

    const conditions = [notInArray(productsCatalogTable.slug, [...RETIRED_PRODUCT_SLUGS])];
    if (published === "true") conditions.push(eq(productsCatalogTable.isPublished, true));
    if (published === "false") conditions.push(eq(productsCatalogTable.isPublished, false));
    if (search) conditions.push(ilike(productsCatalogTable.name, `%${search}%`));
    if (category) conditions.push(eq(productsCatalogTable.category, category));

    const products = await db
      .select()
      .from(productsCatalogTable)
      .where(and(...conditions))
      .orderBy(productsCatalogTable.sortOrder, productsCatalogTable.name);
    res.status(200).json(products.map(catalogToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list catalog products");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/catalog/disable-without-janoshik-report
router.post("/admin/catalog/disable-without-janoshik-report", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureSeeded();
    const disabled = await db
      .update(productsCatalogTable)
      .set({ isPublished: false })
      .where(and(
        eq(productsCatalogTable.isPublished, true),
        ne(productsCatalogTable.category, "Accessories"),
        notInArray(productsCatalogTable.slug, [...JANOSHIK_REPORTED_PRODUCT_SLUGS]),
      ))
      .returning({
        id: productsCatalogTable.id,
        slug: productsCatalogTable.slug,
        name: productsCatalogTable.name,
      });

    res.status(200).json({
      disabledCount: disabled.length,
      disabledProducts: disabled,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to disable products without Janoshik reports");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/catalog/enable-all-peptides
router.post("/admin/catalog/enable-all-peptides", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureSeeded();
    const enabled = await db
      .update(productsCatalogTable)
      .set({ isPublished: true })
      .where(and(
        eq(productsCatalogTable.isPublished, false),
        ne(productsCatalogTable.category, "Accessories"),
      ))
      .returning({
        id: productsCatalogTable.id,
        slug: productsCatalogTable.slug,
        name: productsCatalogTable.name,
      });

    res.status(200).json({
      enabledCount: enabled.length,
      enabledProducts: enabled,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to enable all peptide products");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/catalog/price-sync/preview
// The caller supplies the development catalogue's slug/price rows. This route
// compares them with the current environment without changing either catalogue.
router.post("/admin/catalog/price-sync/preview", async (req: Request, res: Response): Promise<void> => {
  if (!requireSecureAdmin(req, res)) return;
  const secret = priceSyncSecret(res);
  if (!secret) return;
  try {
    const body = strictRequestBody(req.body, ["prices"]);
    const sourcePrices = parseCataloguePrices(body.prices);
    const currentPrices = await db
      .select({
        slug: productsCatalogTable.slug,
        name: productsCatalogTable.name,
        priceGbp: productsCatalogTable.priceGbp,
      })
      .from(productsCatalogTable)
      .orderBy(productsCatalogTable.slug);

    const preview = buildCatalogPricePreview(sourcePrices, currentPrices);
    const confirmationExpiresAt = Date.now() + PRICE_SYNC_CONFIRMATION_TTL_MS;
    res.status(200).json({
      ...preview,
      confirmationToken: createPriceSyncConfirmationToken(
        preview.changes,
        secret,
        confirmationExpiresAt,
      ),
      confirmationExpiresAt: new Date(confirmationExpiresAt).toISOString(),
    });
  } catch (err) {
    if (err instanceof CatalogPriceInputError) {
      res.status(400).json({ error: err.message });
      return;
    }
    req.log.error({ err }, "Failed to preview catalog price sync");
    res.status(500).json({ error: "Internal server error" });
  }
});

class CatalogPriceSyncConflict extends Error {
  constructor(readonly slug: string) {
    super(`Production price changed after preview for ${slug}`);
  }
}

// POST /api/admin/catalog/price-sync/apply
// Applies only the exact reviewed price changes. Slugs must already exist and
// each production price must still match the preview, otherwise all changes roll back.
router.post("/admin/catalog/price-sync/apply", async (req: Request, res: Response): Promise<void> => {
  if (!requireSecureAdmin(req, res)) return;
  const secret = priceSyncSecret(res);
  if (!secret) return;
  try {
    const body = strictRequestBody(req.body, ["changes", "confirmationToken"]);
    const changes = parseApprovedPriceChanges(body.changes);
    if (!verifyPriceSyncConfirmationToken(body.confirmationToken, changes, secret)) {
      res.status(400).json({ error: "The confirmation token is invalid, expired, or does not match the reviewed price diff" });
      return;
    }

    const updatedSlugs = await db.transaction(async (tx) => {
      const slugs: string[] = [];
      for (const change of changes) {
        const currentPriceCondition = change.productionPriceGbp === null
          ? isNull(productsCatalogTable.priceGbp)
          : eq(productsCatalogTable.priceGbp, String(change.productionPriceGbp));
        const [updated] = await tx
          .update(productsCatalogTable)
          .set({
            priceGbp: change.cataloguePriceGbp === null ? null : String(change.cataloguePriceGbp),
          })
          .where(and(
            eq(productsCatalogTable.slug, change.slug),
            currentPriceCondition,
          ))
          .returning({ slug: productsCatalogTable.slug });
        if (!updated) throw new CatalogPriceSyncConflict(change.slug);
        slugs.push(updated.slug);
      }
      return slugs;
    });

    res.status(200).json({
      updatedCount: updatedSlugs.length,
      updatedSlugs,
    });
  } catch (err) {
    if (err instanceof CatalogPriceInputError) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof CatalogPriceSyncConflict) {
      res.status(409).json({
        error: err.message,
        slug: err.slug,
      });
      return;
    }
    req.log.error({ err }, "Failed to apply catalog price sync");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/catalog/:id
router.get("/admin/catalog/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const [product] = await db
      .select()
      .from(productsCatalogTable)
      .where(
        and(
          eq(productsCatalogTable.id, id),
          eq(productsCatalogTable.isPublished, true)
        )
      );
    if (!product || isRetiredProductSlug(product.slug)) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(200).json(catalogToResponse(product));
  } catch (err) {
    req.log.error({ err }, "Failed to get catalog product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/catalog
router.post("/admin/catalog", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const body = req.body as ProductBody;
  if (!isStr(body.slug) || !body.slug || !isStr(body.name) || !body.name || !isStr(body.category) || !body.category) {
    res.status(400).json({ error: "slug, name, and category are required strings" });
    return;
  }
  if (isRetiredProductSlug(body.slug)) {
    res.status(400).json({ error: "This product has been permanently removed from the catalogue" });
    return;
  }
  try {
    const [created] = await db
      .insert(productsCatalogTable)
      .values({
        slug: body.slug,
        name: body.name,
        category: body.category,
        priceGbp: isNum(body.priceGbp) ? String(body.priceGbp) : null,
        shortDescription: strOrNull(body.shortDescription),
        description: strOrNull(body.description),
        imageUrl: toCanonicalCatalogueImageUrl(strOrNull(body.imageUrl)),
        purity: strOrNull(body.purity),
        alsoKnownAs: strOrNull(body.alsoKnownAs),
        molecularWeight: strOrNull(body.molecularWeight),
        casNumber: strOrNull(body.casNumber),
        formula: strOrNull(body.formula),
        sequence: strOrNull(body.sequence),
        storage: strOrNull(body.storage),
        appearance: strOrNull(body.appearance),
        solubility: strOrNull(body.solubility),
        halfLife: strOrNull(body.halfLife),
        seoTitle: strOrNull(body.seoTitle),
        seoDescription: strOrNull(body.seoDescription),
        isPublished: isBool(body.isPublished) ? body.isPublished : true,
        isFeatured: isBool(body.isFeatured) ? body.isFeatured : false,
        sortOrder: isNum(body.sortOrder) ? body.sortOrder : 0,
      })
      .returning();
    await syncInventoryProduct(created);
    res.status(201).json(catalogToResponse(created));
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === "23505") {
      res.status(409).json({ error: "A product with this slug already exists" });
      return;
    }
    req.log.error({ err }, "Failed to create catalog product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/catalog/:id
router.patch("/admin/catalog/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const body = req.body as ProductBody;
  const updates: Partial<typeof productsCatalogTable.$inferInsert> = {};

  if (body.slug !== undefined && isStr(body.slug) && body.slug) updates.slug = body.slug;
  if (body.name !== undefined && isStr(body.name) && body.name) updates.name = body.name;
  if (body.category !== undefined && isStr(body.category) && body.category) updates.category = body.category;
  if (body.priceGbp !== undefined) updates.priceGbp = isNum(body.priceGbp) ? String(body.priceGbp) : null;
  if (body.shortDescription !== undefined) updates.shortDescription = strOrNull(body.shortDescription);
  if (body.description !== undefined) updates.description = strOrNull(body.description);
  if (body.imageUrl !== undefined) updates.imageUrl = toCanonicalCatalogueImageUrl(strOrNull(body.imageUrl));
  if (body.purity !== undefined) updates.purity = strOrNull(body.purity);
  if (body.alsoKnownAs !== undefined) updates.alsoKnownAs = strOrNull(body.alsoKnownAs);
  if (body.molecularWeight !== undefined) updates.molecularWeight = strOrNull(body.molecularWeight);
  if (body.casNumber !== undefined) updates.casNumber = strOrNull(body.casNumber);
  if (body.formula !== undefined) updates.formula = strOrNull(body.formula);
  if (body.sequence !== undefined) updates.sequence = strOrNull(body.sequence);
  if (body.storage !== undefined) updates.storage = strOrNull(body.storage);
  if (body.appearance !== undefined) updates.appearance = strOrNull(body.appearance);
  if (body.solubility !== undefined) updates.solubility = strOrNull(body.solubility);
  if (body.halfLife !== undefined) updates.halfLife = strOrNull(body.halfLife);
  if (body.seoTitle !== undefined) updates.seoTitle = strOrNull(body.seoTitle);
  if (body.seoDescription !== undefined) updates.seoDescription = strOrNull(body.seoDescription);
  if (body.isPublished !== undefined && isBool(body.isPublished)) updates.isPublished = body.isPublished;
  if (body.isFeatured !== undefined && isBool(body.isFeatured)) updates.isFeatured = body.isFeatured;
  if (body.sortOrder !== undefined && isNum(body.sortOrder)) updates.sortOrder = body.sortOrder;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No valid fields to update" });
    return;
  }
  if (updates.slug && isRetiredProductSlug(updates.slug)) {
    res.status(400).json({ error: "This product has been permanently removed from the catalogue" });
    return;
  }

  try {
    const [existing] = await db
      .select({ slug: productsCatalogTable.slug })
      .from(productsCatalogTable)
      .where(eq(productsCatalogTable.id, id));
    if (!existing || isRetiredProductSlug(existing.slug)) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const [updated] = await db
      .update(productsCatalogTable)
      .set(updates)
      .where(eq(productsCatalogTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Product not found" }); return; }
    await syncInventoryProduct(updated);
    res.status(200).json(catalogToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update catalog product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/catalog/:id
// Catalogue entries can be referenced by historical order items, so deletion is
// deliberately implemented as a retirement operation rather than a row delete.
router.delete("/admin/catalog/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const [existing] = await db
      .select()
      .from(productsCatalogTable)
      .where(eq(productsCatalogTable.id, id));
    if (!existing || isRetiredProductSlug(existing.slug)) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const [retired] = await db
      .update(productsCatalogTable)
      .set({ isPublished: false, isFeatured: false })
      .where(eq(productsCatalogTable.id, id))
      .returning();
    if (!retired) { res.status(404).json({ error: "Product not found" }); return; }
    await syncInventoryProduct(retired);
    await db.update(productsInventoryTable)
      .set({ isPublished: false })
      .where(eq(productsInventoryTable.productId, retired.id));
    res.status(200).json(catalogToResponse(retired));
  } catch (err) {
    req.log.error({ err }, "Failed to retire catalog product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── PUBLIC ROUTES ─────────────────────────────────────────────────────────────

// GET /api/products
router.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureSeeded();
    const category = isStr(req.query.category) ? req.query.category : undefined;
    const search = isStr(req.query.search) ? req.query.search : undefined;
    const featured = req.query.featured;

    const conditions = [
      eq(productsCatalogTable.isPublished, true),
      eq(productsInventoryTable.isPublished, true),
      notInArray(productsCatalogTable.slug, [...RETIRED_PRODUCT_SLUGS]),
    ];
    if (category) conditions.push(eq(productsCatalogTable.category, category));
    if (search) conditions.push(ilike(productsCatalogTable.name, `%${search}%`));
    if (featured === "true") conditions.push(eq(productsCatalogTable.isFeatured, true));

    const products = await db
      .select({
        id: productsCatalogTable.id,
        slug: productsCatalogTable.slug,
        name: productsCatalogTable.name,
        category: productsCatalogTable.category,
        priceGbp: productsCatalogTable.priceGbp,
        shortDescription: productsCatalogTable.shortDescription,
        description: productsCatalogTable.description,
        imageUrl: productsCatalogTable.imageUrl,
        purity: productsCatalogTable.purity,
        alsoKnownAs: productsCatalogTable.alsoKnownAs,
        molecularWeight: productsCatalogTable.molecularWeight,
        casNumber: productsCatalogTable.casNumber,
        formula: productsCatalogTable.formula,
        sequence: productsCatalogTable.sequence,
        storage: productsCatalogTable.storage,
        appearance: productsCatalogTable.appearance,
        solubility: productsCatalogTable.solubility,
        halfLife: productsCatalogTable.halfLife,
        seoTitle: productsCatalogTable.seoTitle,
        seoDescription: productsCatalogTable.seoDescription,
        isFeatured: productsCatalogTable.isFeatured,
        stockLevel: productsInventoryTable.stockLevel,
        inventoryPublished: productsInventoryTable.isPublished,
      })
      .from(productsCatalogTable)
      .leftJoin(productsInventoryTable, eq(productsInventoryTable.productId, productsCatalogTable.id))
      .where(and(...conditions))
      .orderBy(productsCatalogTable.sortOrder, productsCatalogTable.name);

    res.set("Cache-Control", "no-store");
    res.status(200).json(
      products.map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: p.category,
          priceGbp: p.priceGbp !== null ? Number(p.priceGbp) : null,
          shortDescription: p.shortDescription,
           description: p.description,
          imageUrl: toPublicCatalogueImageUrl(p.imageUrl),
          purity: p.purity,
          alsoKnownAs: p.alsoKnownAs,
          molecularWeight: p.molecularWeight,
          casNumber: p.casNumber,
          formula: p.formula,
          sequence: p.sequence,
          storage: p.storage,
          appearance: p.appearance,
          solubility: p.solubility,
          halfLife: p.halfLife,
          seoTitle: p.seoTitle ?? null,
          seoDescription: p.seoDescription ?? null,
          isFeatured: p.isFeatured,
          stockLevel: p.stockLevel ?? null,
        }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list public products");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/:slug
router.get("/products/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug);
    if (isRetiredProductSlug(slug)) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const [product] = await db
      .select({
        product: productsCatalogTable,
        inventoryPublished: productsInventoryTable.isPublished,
      })
      .from(productsCatalogTable)
      .leftJoin(productsInventoryTable, eq(productsInventoryTable.productId, productsCatalogTable.id))
      .where(
        and(
          eq(productsCatalogTable.slug, slug),
          eq(productsCatalogTable.isPublished, true),
          eq(productsInventoryTable.isPublished, true)
        )
      );
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(200).json({
      ...catalogToResponse(product.product),
      imageUrl: toPublicCatalogueImageUrl(product.product.imageUrl),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get public product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
