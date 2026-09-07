import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { adminAuditEventsTable } from "@workspace/db/schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { firstString } from "../../lib/query";
import { requireOwner } from "./users";

const router = Router();

router.get(["/admin/security/events", "/admin/audit-history"], async (req: Request, res: Response): Promise<void> => {
  if (!(await requireOwner(req, res))) return;

  const requestedLimit = Number.parseInt(firstString(req.query.limit) ?? "100", 10);
  const limit = Number.isFinite(requestedLimit) ? Math.min(250, Math.max(1, requestedLimit)) : 100;
  const requestedOffset = Number.parseInt(firstString(req.query.offset) ?? "0", 10);
  const offset = Number.isFinite(requestedOffset) ? Math.max(0, requestedOffset) : 0;
  const eventType = firstString(req.query.eventType)?.trim();
  const successValue = firstString(req.query.success);
  const search = firstString(req.query.search)?.trim();

  const conditions = [];
  if (eventType && eventType !== "all") conditions.push(eq(adminAuditEventsTable.eventType, eventType));
  if (successValue === "true" || successValue === "false") {
    conditions.push(eq(adminAuditEventsTable.success, successValue === "true"));
  }
  if (search) {
    const term = `%${search}%`;
    conditions.push(or(
      ilike(adminAuditEventsTable.email, term),
      ilike(adminAuditEventsTable.ip, term),
      ilike(adminAuditEventsTable.eventType, term),
    ));
  }

  try {
    const where = conditions.length ? and(...conditions) : undefined;
    const [events, totalRows, typeRows] = await Promise.all([
      db
        .select()
        .from(adminAuditEventsTable)
        .where(where)
        .orderBy(desc(adminAuditEventsTable.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(adminAuditEventsTable)
        .where(where),
      db
        .select({ eventType: adminAuditEventsTable.eventType })
        .from(adminAuditEventsTable)
        .groupBy(adminAuditEventsTable.eventType)
        .orderBy(adminAuditEventsTable.eventType),
    ]);

    res.json({
      total: totalRows[0]?.count ?? 0,
      limit,
      offset,
      eventTypes: typeRows.map((row) => row.eventType),
      events: events.map((event) => ({
        id: event.id,
        eventType: event.eventType,
        email: event.email,
        ip: event.ip,
        userAgent: event.userAgent,
        requestId: event.requestId,
        success: event.success,
        metadata: event.metadata,
        createdAt: event.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list admin security events");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;