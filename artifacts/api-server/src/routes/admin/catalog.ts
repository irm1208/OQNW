import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { productsCatalogTable, productsInventoryTable } from "@workspace/db";
import { eq, ilike, and, ne, notInArray } from "drizzle-orm";
import { seedProductsCatalog } from "../../lib/seed-catalog";
import { seedReviews } from "../../lib/seed-reviews";
import { hasJanoshikReport, JANOSHIK_REPORTED_PRODUCT_SLUGS } from "../../lib/janoshikReports";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
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
    coaUrl: p.coaUrl ?? null,
    msImageUrl: p.msImageUrl ?? null,
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
  coaUrl?: unknown;
  msImageUrl?: unknown;
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
    await seedReviews();
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

    const conditions = [];
    if (search) conditions.push(ilike(productsCatalogTable.name, `%${search}%`));
    if (category) conditions.push(eq(productsCatalogTable.category, category));
    if (published === "true") conditions.push(eq(productsCatalogTable.isPublished, true));
    if (published === "false") conditions.push(eq(productsCatalogTable.isPublished, false));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const products = await db
      .select()
      .from(productsCatalogTable)
      .where(where)
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

// GET /api/admin/catalog/:id
router.get("/admin/catalog/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const [product] = await db.select().from(productsCatalogTable).where(eq(productsCatalogTable.id, id));
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }
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
        imageUrl: strOrNull(body.imageUrl),
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
        coaUrl: strOrNull(body.coaUrl),
        msImageUrl: strOrNull(body.msImageUrl),
        seoTitle: strOrNull(body.seoTitle),
        seoDescription: strOrNull(body.seoDescription),
        isPublished: isBool(body.isPublished) ? body.isPublished : true,
        isFeatured: isBool(body.isFeatured) ? body.isFeatured : false,
        sortOrder: isNum(body.sortOrder) ? body.sortOrder : 0,
      })
      .returning();
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
  if (body.imageUrl !== undefined) updates.imageUrl = strOrNull(body.imageUrl);
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
  if (body.coaUrl !== undefined) updates.coaUrl = strOrNull(body.coaUrl);
  if (body.msImageUrl !== undefined) updates.msImageUrl = strOrNull(body.msImageUrl);
  if (body.seoTitle !== undefined) updates.seoTitle = strOrNull(body.seoTitle);
  if (body.seoDescription !== undefined) updates.seoDescription = strOrNull(body.seoDescription);
  if (body.isPublished !== undefined && isBool(body.isPublished)) updates.isPublished = body.isPublished;
  if (body.isFeatured !== undefined && isBool(body.isFeatured)) updates.isFeatured = body.isFeatured;
  if (body.sortOrder !== undefined && isNum(body.sortOrder)) updates.sortOrder = body.sortOrder;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No valid fields to update" });
    return;
  }

  try {
    const [updated] = await db
      .update(productsCatalogTable)
      .set(updates)
      .where(eq(productsCatalogTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Product not found" }); return; }
    res.status(200).json(catalogToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update catalog product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/catalog/:id/upload-doc — upload a lab document (COA / MS)
router.post(
  "/admin/catalog/:id/upload-doc",
  (req: Request, res: Response, next) => {
    if (!requireAdmin(req, res)) return;
    next();
  },
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

    const docType = isStr(req.query.type) ? req.query.type : "coa";
    const url = `/uploads/${req.file.filename}`;

    const field =
      docType === "ms" ? "msImageUrl" : "coaUrl";

    try {
      const [updated] = await db
        .update(productsCatalogTable)
        .set({ [field]: url } as Partial<typeof productsCatalogTable.$inferInsert>)
        .where(eq(productsCatalogTable.id, id))
        .returning();
      if (!updated) { res.status(404).json({ error: "Product not found" }); return; }
      res.status(200).json({ url });
    } catch (err) {
      req.log.error({ err }, "Failed to save uploaded document URL");
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE /api/admin/catalog/:id
router.delete("/admin/catalog/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const [deleted] = await db
      .delete(productsCatalogTable)
      .where(eq(productsCatalogTable.id, id))
      .returning({ id: productsCatalogTable.id });
    if (!deleted) { res.status(404).json({ error: "Product not found" }); return; }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete catalog product");
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

    const conditions = [eq(productsCatalogTable.isPublished, true)];
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
        imageUrl: productsCatalogTable.imageUrl,
        purity: productsCatalogTable.purity,
        coaUrl: productsCatalogTable.coaUrl,
        msImageUrl: productsCatalogTable.msImageUrl,
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
      products
        .filter(p => p.inventoryPublished !== false)
        .map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: p.category,
          priceGbp: p.priceGbp !== null ? Number(p.priceGbp) : null,
          shortDescription: p.shortDescription,
          imageUrl: p.imageUrl,
          purity: p.purity,
          coaUrl: p.coaUrl ?? null,
          msImageUrl: p.msImageUrl ?? null,
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
    const [product] = await db
      .select()
      .from(productsCatalogTable)
      .where(
        and(
          eq(productsCatalogTable.slug, slug),
          eq(productsCatalogTable.isPublished, true)
        )
      );
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }
    res.status(200).json(catalogToResponse(product));
  } catch (err) {
    req.log.error({ err }, "Failed to get public product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
