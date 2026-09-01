import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { emailLogsTable } from "@workspace/db";
import { desc, eq, count } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

router.get("/admin/email-logs", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  try {
    const [logs, statsRows] = await Promise.all([
      db
        .select()
        .from(emailLogsTable)
        .orderBy(desc(emailLogsTable.createdAt))
        .limit(500),
      db.select({ status: emailLogsTable.status, cnt: count() })
        .from(emailLogsTable)
        .groupBy(emailLogsTable.status),
    ]);

    const sent = statsRows.find((r) => r.status === "sent")?.cnt ?? 0;
    const failed = statsRows.find((r) => r.status === "failed")?.cnt ?? 0;

    res.json({
      logs: logs.map((l) => ({
        id: l.id,
        toEmail: l.toEmail,
        subject: l.subject,
        type: l.type,
        status: l.status,
        resendId: l.resendId ?? null,
        orderNumber: l.orderNumber ?? null,
        createdAt: l.createdAt.toISOString(),
      })),
      stats: {
        total: Number(sent) + Number(failed),
        sent: Number(sent),
        failed: Number(failed),
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list email logs");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
