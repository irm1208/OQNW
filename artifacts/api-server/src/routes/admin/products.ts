import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { productsInventoryTable } from "@workspace/db";
import {
  ListAdminProductsQueryParams,
  UpdateProductInventoryParams,
  UpdateProductInventoryBody,
  UpdateProductVisibilityParams,
  UpdateProductVisibilityBody,
} from "@workspace/api-zod";
import { eq, ilike, and, sql } from "drizzle-orm";
import { sendLowStockAlert } from "../../lib/email";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function productToResponse(p: typeof productsInventoryTable.$inferSelect) {
  return {
    id: p.id,
    productId: p.productId,
    productName: p.productName,
    productCategory: p.productCategory,
    productImage: p.productImage ?? null,
    stockLevel: p.stockLevel,
    lowStockThreshold: p.lowStockThreshold,
    isPublished: p.isPublished,
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/admin/products", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const parsed = ListAdminProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { search, lowStock } = parsed.data;
  try {
    const conditions = [];
    if (search) conditions.push(ilike(productsInventoryTable.productName, `%${search}%`));
    if (lowStock === true || lowStock === "true" as unknown) {
      conditions.push(
        sql`${productsInventoryTable.stockLevel} <= ${productsInventoryTable.lowStockThreshold}`
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const products = await db
      .select()
      .from(productsInventoryTable)
      .where(where)
      .orderBy(productsInventoryTable.productName);
    res.status(200).json(products.map(productToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/products/:id/inventory", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const paramsParsed = UpdateProductInventoryParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = UpdateProductInventoryBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  try {
    const updates: Partial<typeof productsInventoryTable.$inferInsert> = {};
    const { stockLevel, lowStockThreshold } = bodyParsed.data;
    if (stockLevel !== undefined) updates.stockLevel = stockLevel;
    if (lowStockThreshold !== undefined) updates.lowStockThreshold = lowStockThreshold;

    const [updated] = await db
      .update(productsInventoryTable)
      .set(updates)
      .where(eq(productsInventoryTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(productToResponse(updated));

    const effectiveThreshold = updated.lowStockThreshold;
    if (updated.stockLevel <= effectiveThreshold) {
      sendLowStockAlert([{
        productName: updated.productName,
        stockLevel: updated.stockLevel,
        lowStockThreshold: effectiveThreshold,
      }]).catch(() => {});
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update inventory");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/products/:id/visibility", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const paramsParsed = UpdateProductVisibilityParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = UpdateProductVisibilityBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  try {
    const [updated] = await db
      .update(productsInventoryTable)
      .set({ isPublished: bodyParsed.data.isPublished })
      .where(eq(productsInventoryTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(200).json(productToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update visibility");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
