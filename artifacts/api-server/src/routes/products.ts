import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { orderItemsTable, productsInventoryTable } from "@workspace/db";
import { sql, ne, eq } from "drizzle-orm";

const router = Router();

router.get("/products/:productId/related", async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(req.params.productId, 10);
  if (isNaN(productId) || productId <= 0) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  try {
    const rows = await db.execute(sql`
      SELECT
        oi2.product_id        AS "productId",
        MAX(oi2.product_name) AS "productName",
        MAX(oi2.product_category) AS "productCategory",
        COUNT(*)::int         AS "coOccurrences"
      FROM order_items oi1
      JOIN order_items oi2
        ON oi1.order_id = oi2.order_id
       AND oi2.product_id <> oi1.product_id
       AND oi2.product_id <> 0
      WHERE oi1.product_id = ${productId}
      GROUP BY oi2.product_id
      ORDER BY "coOccurrences" DESC
      LIMIT 8
    `);

    const related = rows.rows as {
      productId: number;
      productName: string;
      productCategory: string;
      coOccurrences: number;
    }[];

    const inventory = related.length > 0
      ? await db
          .select({
            productId: productsInventoryTable.productId,
            stockLevel: productsInventoryTable.stockLevel,
            productImage: productsInventoryTable.productImage,
            isPublished: productsInventoryTable.isPublished,
          })
          .from(productsInventoryTable)
          .where(
            sql`${productsInventoryTable.productId} = ANY(${sql.raw(
              `ARRAY[${related.map((r) => r.productId).join(",")}]::int[]`
            )})`
          )
      : [];

    const invMap = new Map(inventory.map((i) => [i.productId, i]));

    const result = related
      .filter((r) => {
        const inv = invMap.get(r.productId);
        return !inv || (inv.isPublished && inv.stockLevel > 0);
      })
      .slice(0, 5)
      .map((r) => ({
        productId: r.productId,
        productName: r.productName,
        productCategory: r.productCategory,
        coOccurrences: r.coOccurrences,
        stockLevel: invMap.get(r.productId)?.stockLevel ?? null,
        productImage: invMap.get(r.productId)?.productImage ?? null,
      }));

    res.status(200).json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch related products");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
