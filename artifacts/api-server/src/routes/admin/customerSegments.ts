import { Router } from "express";
import type { Request, Response } from "express";
import { adminAuditEventsTable, customerSegmentsTable, db, type CustomerSegmentRules } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import {
  createCustomerSegmentSchema,
  customerSegmentCountQuery,
  customerSegmentMembersQuery,
  patchCustomerSegmentSchema,
} from "../../lib/customerSegments";
import { getSecureAdminSession } from "./auth";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function segmentResponse(segment: typeof customerSegmentsTable.$inferSelect, matchCount?: number) {
  return {
    id: segment.id, name: segment.name, description: segment.description ?? null, rules: segment.rules,
    isActive: segment.isActive, createdAt: segment.createdAt.toISOString(), updatedAt: segment.updatedAt.toISOString(),
    ...(matchCount === undefined ? {} : { matchCount }),
  };
}

async function writeAudit(req: Request, eventType: string, metadata: Record<string, unknown>) {
  const session = getSecureAdminSession(req);
  await db.insert(adminAuditEventsTable).values({
    eventType, email: session?.email ?? null, ip: req.ip || req.socket.remoteAddress || "unknown",
    userAgent: req.get("user-agent")?.slice(0, 500) ?? null, requestId: String(req.id), success: true, metadata,
  });
}

function idFromRequest(req: Request): number | null {
  const id = Number(req.params.id);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function pagination(req: Request): { limit: number; offset: number } | null {
  const limit = req.query.limit === undefined ? 50 : Number(req.query.limit);
  const offset = req.query.offset === undefined ? 0 : Number(req.query.offset);
  return Number.isInteger(limit) && limit >= 1 && limit <= 200 && Number.isInteger(offset) && offset >= 0 ? { limit, offset } : null;
}

router.get("/admin/customer-segments", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const segments = await db.select().from(customerSegmentsTable).where(eq(customerSegmentsTable.isActive, true)).orderBy(desc(customerSegmentsTable.createdAt));
    const result = await Promise.all(segments.map(async segment => {
      const countResult = await db.execute(customerSegmentCountQuery(segment.rules));
      const matchCount = Number((countResult.rows[0] as Record<string, unknown>)?.total ?? 0);
      return segmentResponse(segment, matchCount);
    }));
    res.json({ segments: result });
  } catch (err) {
    req.log.error({ err }, "Failed to list customer segments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/customer-segments", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const parsed = createCustomerSegmentSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid customer segment" }); return; }
  try {
    const [created] = await db.insert(customerSegmentsTable).values(parsed.data).returning();
    await writeAudit(req, "customer_segment_created", { segmentId: created.id });
    res.status(201).json({ segment: segmentResponse(created, 0) });
  } catch (err) {
    if ((err as { code?: string })?.code === "23505") {
      res.status(409).json({ error: "An active segment with this name already exists" });
      return;
    }
    req.log.error({ err }, "Failed to create customer segment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/customer-segments/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = idFromRequest(req); const page = pagination(req);
  if (!id || !page) { res.status(400).json({ error: "Invalid segment ID or pagination" }); return; }
  try {
    const [segment] = await db.select().from(customerSegmentsTable).where(eq(customerSegmentsTable.id, id)).limit(1);
    if (!segment) { res.status(404).json({ error: "Customer segment not found" }); return; }
    const query = customerSegmentMembersQuery(segment.rules as CustomerSegmentRules, page.limit, page.offset);
    const countQuery = customerSegmentCountQuery(segment.rules as CustomerSegmentRules);
    const [membersResult, totalResult] = await Promise.all([db.execute(query), db.execute(countQuery)]);
    const members = membersResult.rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id), name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(), email: String(row.email),
      orderCount: Number(row.order_count), totalSpendGbp: Number(row.total_spend_gbp), lastOrderAt: row.last_order_at ? new Date(String(row.last_order_at)).toISOString() : null,
      marketingStatus: row.marketing_status,
    }));
    res.json({ segment: segmentResponse(segment), members, total: Number((totalResult.rows[0] as Record<string, unknown>)?.total ?? 0) });
  } catch (err) {
    req.log.error({ err }, "Failed to get customer segment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/customer-segments/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = idFromRequest(req); const parsed = patchCustomerSegmentSchema.safeParse(req.body);
  if (!id || !parsed.success) { res.status(400).json({ error: "Invalid customer segment" }); return; }
  try {
    const [updated] = await db.update(customerSegmentsTable).set(parsed.data).where(eq(customerSegmentsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Customer segment not found" }); return; }
    await writeAudit(req, "customer_segment_updated", { segmentId: id, fields: Object.keys(parsed.data) });
    res.json({ segment: segmentResponse(updated) });
  } catch (err) {
    if ((err as { code?: string })?.code === "23505") {
      res.status(409).json({ error: "An active segment with this name already exists" });
      return;
    }
    req.log.error({ err }, "Failed to update customer segment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/customer-segments/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = idFromRequest(req);
  if (!id) { res.status(400).json({ error: "Invalid segment ID" }); return; }
  try {
    const [archived] = await db.update(customerSegmentsTable).set({ isActive: false }).where(eq(customerSegmentsTable.id, id)).returning();
    if (!archived) { res.status(404).json({ error: "Customer segment not found" }); return; }
    await writeAudit(req, "customer_segment_archived", { segmentId: id });
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to archive customer segment");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;