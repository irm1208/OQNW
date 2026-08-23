import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { customersTable, productsInventoryTable, refundsLogTable, inventoryAuditLogTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRow(values: unknown[]): string {
  return values.map(escapeCsv).join(",");
}

router.get("/admin/export/customers.csv", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const customers = await db
      .select()
      .from(customersTable)
      .orderBy(desc(customersTable.createdAt));

    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Total Orders", "Total Spent (GBP)", "Created At"];
    const rows = customers.map(c => toCsvRow([
      c.id, c.firstName, c.lastName, c.email, c.phone ?? "",
      c.totalOrders, parseFloat(String(c.totalSpendGbp ?? 0)).toFixed(2),
      c.createdAt.toISOString(),
    ]));

    const csv = [headers.join(","), ...rows].join("\n");
    const today = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="customers-${today}.csv"`);
    res.send(csv);
  } catch (err) {
    req.log.error({ err }, "Failed to export customers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/export/products.csv", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const products = await db
      .select()
      .from(productsInventoryTable)
      .orderBy(productsInventoryTable.productId);

    const headers = ["Product ID", "Name", "Category", "Stock Level", "Low Stock Threshold", "Is Published", "Updated At"];
    const rows = products.map(p => toCsvRow([
      p.productId, p.productName, p.productCategory,
      p.stockLevel, p.lowStockThreshold, p.isPublished ? "Yes" : "No",
      p.updatedAt.toISOString(),
    ]));

    const csv = [headers.join(","), ...rows].join("\n");
    const today = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="products-${today}.csv"`);
    res.send(csv);
  } catch (err) {
    req.log.error({ err }, "Failed to export products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/export/refunds.csv", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const refunds = await db
      .select()
      .from(refundsLogTable)
      .orderBy(desc(refundsLogTable.createdAt));

    const headers = ["ID", "Order Number", "Amount (GBP)", "Type", "Reason", "Notes", "Restore Inventory", "Created At"];
    const rows = refunds.map(r => toCsvRow([
      r.id, r.orderNumber, parseFloat(String(r.amountGbp)).toFixed(2),
      r.type, r.reason, r.notes ?? "", r.restoreInventory ? "Yes" : "No",
      r.createdAt.toISOString(),
    ]));

    const csv = [headers.join(","), ...rows].join("\n");
    const today = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="refunds-${today}.csv"`);
    res.send(csv);
  } catch (err) {
    req.log.error({ err }, "Failed to export refunds");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/export/inventory-audit.csv", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const entries = await db
      .select()
      .from(inventoryAuditLogTable)
      .orderBy(desc(inventoryAuditLogTable.createdAt))
      .limit(5000);

    const headers = ["ID", "Product ID", "Product Name", "Change Type", "Before", "After", "Change", "Reason", "Reference", "Date"];
    const rows = entries.map(e => toCsvRow([
      e.id, e.productId, e.productName, e.changeType,
      e.quantityBefore, e.quantityAfter, e.quantityChange,
      e.reason ?? "", e.referenceId ?? "", e.createdAt.toISOString(),
    ]));

    const csv = [headers.join(","), ...rows].join("\n");
    const today = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="inventory-audit-${today}.csv"`);
    res.send(csv);
  } catch (err) {
    req.log.error({ err }, "Failed to export inventory audit");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
