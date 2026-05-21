import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { customersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendPasswordReset } from "../lib/email";
import { getClientIp, lookupCountry } from "../lib/geoip";

const router = Router();

const SESSION_SECRET =
  process.env.SESSION_SECRET ??
  process.env.ADMIN_PASSWORD ??
  "omniqure-cust-session-fallback-secret";
const COOKIE_NAME = "customer_session";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

function signToken(customerId: number): string {
  const payload = String(customerId);
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

function verifyToken(token: string): number | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  if (sig !== expected) return null;
  const id = parseInt(payload, 10);
  return isNaN(id) ? null : id;
}

router.post("/auth/register", async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, institution, referredBy } = req.body as {
    email: unknown;
    password: unknown;
    firstName: unknown;
    lastName: unknown;
    institution?: unknown;
    referredBy?: unknown;
  };

  if (
    typeof email !== "string" ||
    !email.includes("@") ||
    typeof password !== "string" ||
    password.length < 8 ||
    typeof firstName !== "string" ||
    !firstName.trim() ||
    typeof lastName !== "string" ||
    !lastName.trim()
  ) {
    res.status(400).json({ error: "Invalid registration data" });
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.email, email.toLowerCase()))
      .limit(1);

    if (existing) {
      if (existing.passwordHash) {
        // Real account already exists — cannot register again
        res.status(409).json({ error: "An account with this email already exists" });
        return;
      }

      // Guest account (no password) — upgrade it with the new credentials
      const passwordHash = await bcrypt.hash(password, 12);
      const [upgraded] = await db
        .update(customersTable)
        .set({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          passwordHash,
        })
        .where(eq(customersTable.id, existing.id))
        .returning();

      const token = signToken(upgraded.id);
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });

      req.log.info({ customerId: upgraded.id }, "Guest account upgraded to full account");
      const ipUpgrade = getClientIp(req);
      if (ipUpgrade) {
        lookupCountry(ipUpgrade).then((cc) => {
          if (cc) db.update(customersTable).set({ lastSeenIp: ipUpgrade, lastSeenCountry: cc }).where(eq(customersTable.id, upgraded.id)).catch(() => {});
        }).catch(() => {});
      }
      res.status(200).json({
        id: upgraded.id,
        email: upgraded.email,
        firstName: upgraded.firstName,
        lastName: upgraded.lastName,
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const refBy = typeof referredBy === "string" && referredBy.trim() ? referredBy.trim().toUpperCase() : null;

    const [customer] = await db
      .insert(customersTable)
      .values({
        email: email.toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        passwordHash,
        totalOrders: 0,
        totalSpendGbp: "0",
        referredBy: refBy,
      })
      .returning();

    const generatedCode = `${firstName.trim().slice(0, 3).toUpperCase()}${String(customer.id).padStart(4, "0")}`;
    const ipReg = getClientIp(req);
    lookupCountry(ipReg ?? "").then((cc) => {
      const updates: Record<string, string> = { referralCode: generatedCode };
      if (ipReg) updates.lastSeenIp = ipReg;
      if (cc) updates.lastSeenCountry = cc;
      db.update(customersTable).set(updates).where(eq(customersTable.id, customer.id)).catch(() => {});
    }).catch(() => {
      db.update(customersTable).set({ referralCode: generatedCode }).where(eq(customersTable.id, customer.id)).catch(() => {});
    });

    const token = signToken(customer.id);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    res.status(201).json({
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to register customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: unknown; password: unknown };

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const [customer] = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.email, email.toLowerCase()))
      .limit(1);

    if (!customer || !customer.passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const match = await bcrypt.compare(password, customer.passwordHash);
    if (!match) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signToken(customer.id);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    const ipLogin = getClientIp(req);
    if (ipLogin) {
      lookupCountry(ipLogin).then((cc) => {
        if (cc) db.update(customersTable).set({ lastSeenIp: ipLogin, lastSeenCountry: cc }).where(eq(customersTable.id, customer.id)).catch(() => {});
      }).catch(() => {});
    }

    res.status(200).json({
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to sign in customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/forgot-password", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as { email: unknown };
  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email address is required" });
    return;
  }
  try {
    const [customer] = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.email, email.toLowerCase()))
      .limit(1);

    if (customer && customer.passwordHash) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await db
        .update(customersTable)
        .set({ resetToken: token, resetTokenExpiresAt: expiresAt })
        .where(eq(customersTable.id, customer.id));

      const siteUrl = (
        process.env.SITE_URL ||
        (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://omniqure.com")
      ).replace(/\/$/, "");
      const resetUrl = `${siteUrl}/reset-password?token=${token}`;
      sendPasswordReset({
        customerEmail: customer.email,
        customerName: `${customer.firstName} ${customer.lastName}`,
        resetUrl,
      }).catch(() => {});

      req.log.info({ customerId: customer.id }, "Password reset token issued");
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to process forgot-password");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/reset-password", async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body as { token: unknown; password: unknown };
  if (typeof token !== "string" || !token.trim()) {
    res.status(400).json({ error: "Reset token is required" });
    return;
  }
  if (typeof password !== "string" || password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }
  try {
    const [customer] = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.resetToken, token.trim()))
      .limit(1);

    if (!customer || !customer.resetTokenExpiresAt || customer.resetTokenExpiresAt < new Date()) {
      res.status(400).json({ error: "This reset link is invalid or has expired. Please request a new one." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db
      .update(customersTable)
      .set({ passwordHash, resetToken: null, resetTokenExpiresAt: null })
      .where(eq(customersTable.id, customer.id));

    req.log.info({ customerId: customer.id }, "Password reset successfully");
    res.status(200).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to reset password");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", (_req: Request, res: Response): void => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.status(200).json({ ok: true });
});

router.get("/auth/me", async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const customerId = verifyToken(token);
  if (!customerId) {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.status(401).json({ error: "Invalid session" });
    return;
  }

  try {
    const [customer] = await db
      .select({
        id: customersTable.id,
        email: customersTable.email,
        firstName: customersTable.firstName,
        lastName: customersTable.lastName,
      })
      .from(customersTable)
      .where(eq(customersTable.id, customerId))
      .limit(1);

    if (!customer) {
      res.clearCookie(COOKIE_NAME, { path: "/" });
      res.status(401).json({ error: "Customer not found" });
      return;
    }

    res.status(200).json(customer);
  } catch (err) {
    req.log.error({ err }, "Failed to get customer session");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
