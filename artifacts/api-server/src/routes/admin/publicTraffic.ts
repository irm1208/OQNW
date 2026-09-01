import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { publicTrafficEventsTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";
import { hasSecureAdminSession } from "./auth";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (!hasSecureAdminSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

router.get("/admin/public-traffic/events", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const parsedLimit = Number(req.query.limit);
  const limit = Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 200) : 50;

  try {
    const events = await db
      .select()
      .from(publicTrafficEventsTable)
      .orderBy(desc(publicTrafficEventsTable.createdAt))
      .limit(limit);
    res.setHeader("Cache-Control", "no-store");
    res.json(events.map((event) => ({
      ...event,
      createdAt: event.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch public traffic events");
    res.status(500).json({ error: "Failed to fetch public traffic events" });
  }
});

export default router;