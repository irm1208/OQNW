import { Router } from "express";
import type { Request, Response } from "express";
import { AdminLoginBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { blockedIpsTable, adminUsersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "./users";
import { createHmac, timingSafeEqual } from "crypto";
import { createWallidTestCheckoutToken } from "../../lib/wallidTestCheckout";
import { createCryptoTestCheckoutToken } from "../../lib/cryptoTestCheckout";
import { getPublicCryptoPaymentOptions } from "../../lib/crypto-payments";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "omniqure-admin-2024";
const SESSION_COOKIE = "admin_session";
const EMAIL_COOKIE = "admin_email";
const SESSION_VALUE = "authenticated";
const SECURE_SESSION_COOKIE = "admin_secure_session";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 30 * 60 * 1000; // reset window after 30 min of no activity

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
  lastAttemptAt: number;
}

function secureSessionValue(): string {
  const expiresAt = Date.now() + COOKIE_MAX_AGE;
  const payload = `admin:${expiresAt}`;
  const signature = createHmac("sha256", process.env.SESSION_SECRET ?? ADMIN_PASSWORD).update(payload).digest("base64url");
  return `${payload}:${signature}`;
}

export function hasSecureAdminSession(req: Request): boolean {
  const value = req.cookies?.[SECURE_SESSION_COOKIE];
  if (typeof value !== "string") return false;
  const [role, expires, signature] = value.split(":");
  if (role !== "admin" || !/^\d+$/.test(expires) || !signature || Number(expires) < Date.now()) return false;
  const payload = `${role}:${expires}`;
  const expected = createHmac("sha256", process.env.SESSION_SECRET ?? ADMIN_PASSWORD).update(payload).digest("base64url");
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
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

  const [blocked] = await db
    .select({ ip: blockedIpsTable.ip })
    .from(blockedIpsTable)
    .where(eq(blockedIpsTable.ip, ip))
    .limit(1);

  if (blocked) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

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
  const email = typeof (req.body as { email?: unknown })?.email === "string"
    ? (req.body as { email: string }).email.toLowerCase().trim()
    : "";

  let authed = false;
  let sessionEmail: string | null = null;

  if (email) {
    const [user] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, email))
      .limit(1);
    if (user && user.isActive && verifyPassword(password, user.passwordHash)) {
      authed = true;
      sessionEmail = user.email;
      await db.update(adminUsersTable).set({ lastLoginAt: new Date() }).where(eq(adminUsersTable.id, user.id));
    }
  } else if (password === ADMIN_PASSWORD) {
    authed = true;
  }

  if (!authed) {
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
  res.cookie(SECURE_SESSION_COOKIE, secureSessionValue(), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  if (sessionEmail) {
    res.cookie(EMAIL_COOKIE, sessionEmail, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  } else {
    res.clearCookie(EMAIL_COOKIE);
  }
  res.status(200).json({ authenticated: true });
});

router.post("/admin/auth/logout", (_req: Request, res: Response): void => {
  res.clearCookie(SESSION_COOKIE);
  res.clearCookie(SECURE_SESSION_COOKIE);
  res.clearCookie(EMAIL_COOKIE);
  res.status(204).send();
});

router.post("/admin/test-payments/session", (req: Request, res: Response): void => {
  if (!hasSecureAdminSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const testCheckoutSecret = process.env.SESSION_SECRET;
  if (!testCheckoutSecret) {
    res.status(503).json({ error: "Wallid test checkout is unavailable because secure session signing is not configured." });
    return;
  }

  const { token, expiresAt } = createWallidTestCheckoutToken(
    testCheckoutSecret,
  );
  res.status(201).json({
    checkoutPath: `/cart?wallidTest=${encodeURIComponent(token)}`,
    expiresAt,
    amountMinor: 100,
    currency: "GBP",
  });
});

router.post("/admin/test-payments/crypto-session", async (req: Request, res: Response): Promise<void> => {
  if (!hasSecureAdminSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const testCheckoutSecret = process.env.SESSION_SECRET;
  if (!testCheckoutSecret) {
    res.status(503).json({ error: "Crypto test checkout is unavailable because secure session signing is not configured." });
    return;
  }

  try {
    const routes = await getPublicCryptoPaymentOptions();
    if (routes.length === 0) {
      res.status(409).json({ error: "Enable crypto payments and save at least one valid receiving address before creating a test checkout." });
      return;
    }

    const { token, expiresAt } = createCryptoTestCheckoutToken(testCheckoutSecret);
    res.status(201).json({
      checkoutPath: `/cart?cryptoTest=${encodeURIComponent(token)}`,
      expiresAt,
      amountMinor: 100,
      currency: "GBP",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create crypto test checkout");
    res.status(503).json({ error: "Crypto test checkout is temporarily unavailable." });
  }
});

router.get("/admin/auth/me", async (req: Request, res: Response): Promise<void> => {
  const session = req.cookies?.[SESSION_COOKIE];
  if (session !== SESSION_VALUE) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const email = req.cookies?.[EMAIL_COOKIE];
  if (typeof email === "string" && email) {
    const [user] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, email))
      .limit(1);
    if (user && user.isActive) {
      res.status(200).json({ authenticated: true, email: user.email, name: user.name, role: user.role });
      return;
    }
  }
  res.status(200).json({ authenticated: true, role: "owner", name: "Owner" });
});

export default router;
