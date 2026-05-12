import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { customersTable, ordersTable } from "@workspace/db";
import {
  ListAdminCustomersQueryParams,
  GetAdminCustomerParams,
} from "@workspace/api-zod";
import { eq, ilike, or, and, desc, count } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function customerToResponse(c: typeof customersTable.$inferSelect) {
  return {
    id: c.id,
    email: c.email,
    firstName: c.firstName,
    lastName: c.lastName,
    phone: c.phone ?? null,
    country: c.country ?? null,
    city: c.city ?? null,
    totalOrders: c.totalOrders,
    totalSpendGbp: parseFloat(String(c.totalSpendGbp)),
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/admin/customers", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const parsed = ListAdminCustomersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { search, limit = 20, offset = 0 } = parsed.data;
  try {
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(customersTable.email, `%${search}%`),
          ilike(customersTable.firstName, `%${search}%`),
          ilike(customersTable.lastName, `%${search}%`)
        )
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const [customers, totalRow] = await Promise.all([
      db
        .select()
        .from(customersTable)
        .where(where)
        .orderBy(desc(customersTable.createdAt))
        .limit(Number(limit))
        .offset(Number(offset)),
      db.select({ cnt: count() }).from(customersTable).where(where),
    ]);
    res.status(200).json({
      customers: customers.map(customerToResponse),
      total: Number(totalRow[0]?.cnt ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list customers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/customers/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const parsed = GetAdminCustomerParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid customer ID" });
    return;
  }
  try {
    const [customer] = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.id, parsed.data.id));
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.customerId, customer.id))
      .orderBy(desc(ordersTable.createdAt));

    res.status(200).json({
      ...customerToResponse(customer),
      address1: customer.address1 ?? null,
      address2: customer.address2 ?? null,
      county: customer.county ?? null,
      postcode: customer.postcode ?? null,
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        customerEmail: o.customerEmail,
        customerName: o.customerName,
        customerId: o.customerId ?? null,
        subtotalGbp: parseFloat(String(o.subtotalGbp)),
        shippingCostGbp: parseFloat(String(o.shippingCostGbp)),
        totalGbp: parseFloat(String(o.totalGbp)),
        shippingMethod: o.shippingMethod ?? null,
        trackingNumber: o.trackingNumber ?? null,
        notes: o.notes ?? null,
        country: o.country ?? null,
        city: o.city ?? null,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
