import { Router } from "express";
import type { Request, Response } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "omniqure-admin-2024";
const SESSION_COOKIE = "admin_session";
const SESSION_VALUE = "authenticated";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 30 * 60 * 1000; // reset window after 30 min of no activity

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
  lastAttemptAt: number;
}

const attemptsByIp = new Map<string, AttemptRecord>();

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress ?? "unknown";
}

function getRecord(ip: string): AttemptRecord {
  const existing = attemptsByIp.get(ip);
  if (!existing) return { count: 0, lockedUntil: null, lastAttemptAt: Date.now() };

  const now = Date.now();

  if (existing.lockedUntil && now > existing.lockedUntil) {
    attemptsByIp.delete(ip);
    return { count: 0, lockedUntil: null, lastAttemptAt: now };
  }

  if (!existing.lockedUntil && now - existing.lastAttemptAt > ATTEMPT_WINDOW_MS) {
    attemptsByIp.delete(ip);
    return { count: 0, lockedUntil: null, lastAttemptAt: now };
  }

  return existing;
}

router.post("/admin/auth/login", async (req: Request, res: Response): Promise<void> => {
  const ip = getClientIp(req);
  const record = getRecord(ip);

  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const retryAfterMs = record.lockedUntil - Date.now();
    res.status(429).json({
      error: "Too many failed attempts. Account temporarily locked.",
      lockedUntil: record.lockedUntil,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    });
    return;
  }

  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { password } = parsed.data;

  if (password !== ADMIN_PASSWORD) {
    const newCount = record.count + 1;
    const remaining = MAX_ATTEMPTS - newCount;
    const lockedUntil = remaining <= 0 ? Date.now() + LOCKOUT_MS : null;

    attemptsByIp.set(ip, {
      count: newCount,
      lockedUntil,
      lastAttemptAt: Date.now(),
    });

    if (lockedUntil) {
      res.status(429).json({
        error: "Too many failed attempts. Account temporarily locked.",
        lockedUntil,
        retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000),
      });
    } else {
      res.status(401).json({
        error: "Invalid password",
        attemptsRemaining: remaining,
      });
    }
    return;
  }

  attemptsByIp.delete(ip);

  res.cookie(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  res.status(200).json({ authenticated: true });
});

router.post("/admin/auth/logout", (_req: Request, res: Response): void => {
  res.clearCookie(SESSION_COOKIE);
  res.status(204).send();
});

router.get("/admin/auth/me", (req: Request, res: Response): void => {
  const session = req.cookies?.[SESSION_COOKIE];
  if (session === SESSION_VALUE) {
    res.status(200).json({ authenticated: true });
    return;
  }
  res.status(401).json({ error: "Not authenticated" });
});

export default router;
