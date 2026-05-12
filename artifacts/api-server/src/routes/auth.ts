import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { customersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

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
  const { email, password, firstName, lastName, institution } = req.body as {
    email: unknown;
    password: unknown;
    firstName: unknown;
    lastName: unknown;
    institution?: unknown;
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
      .select({ id: customersTable.id })
      .from(customersTable)
      .where(eq(customersTable.email, email.toLowerCase()))
      .limit(1);

    if (existing) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [customer] = await db
      .insert(customersTable)
      .values({
        email: email.toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        passwordHash,
        totalOrders: 0,
        totalSpendGbp: "0",
      })
      .returning();

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
