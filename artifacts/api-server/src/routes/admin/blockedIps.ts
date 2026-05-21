import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { blockedIpsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

router.get("/admin/blocked-ips", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const rows = await db
      .select()
      .from(blockedIpsTable)
      .orderBy(blockedIpsTable.blockedAt);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blocked IPs" });
  }
});

router.post("/admin/blocked-ips", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { ip, reason } = req.body as { ip?: string; reason?: string };
  if (!ip || typeof ip !== "string" || !ip.trim()) {
    res.status(400).json({ error: "ip is required" });
    return;
  }
  const normalized = ip.trim();
  try {
    const [row] = await db
      .insert(blockedIpsTable)
      .values({ ip: normalized, reason: reason?.trim() || null })
      .onConflictDoNothing()
      .returning();
    if (!row) {
      res.status(409).json({ error: "IP already blocked" });
      return;
    }
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed to block IP" });
  }
});

router.delete("/admin/blocked-ips/:ip", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const ip = decodeURIComponent(req.params.ip);
  try {
    const deleted = await db
      .delete(blockedIpsTable)
      .where(eq(blockedIpsTable.ip, ip))
      .returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: "IP not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to unblock IP" });
  }
});

export default router;
