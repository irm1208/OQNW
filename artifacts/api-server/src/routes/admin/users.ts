import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { adminUsersTable, ADMIN_ROLES } from "@workspace/db";
import { and, eq, desc, ne, sql } from "drizzle-orm";
import { firstString } from "../../lib/query";
import { getSecureAdminSession, validateSecureAdminSession } from "./auth";

const router = Router();
export const OWNER_MUTATION_LOCK_KEY = 1479362841;

export class LastActiveOwnerError extends Error {
  constructor() {
    super("The last active owner cannot be removed");
    this.name = "LastActiveOwnerError";
  }
}

export interface OwnerGuardUser {
  role: string;
  isActive: boolean;
}

export async function protectLastActiveOwner<T>(
  lock: () => Promise<void>,
  findTarget: () => Promise<OwnerGuardUser | null>,
  hasOtherActiveOwner: () => Promise<boolean>,
  removesOwner: (target: OwnerGuardUser) => boolean,
  mutate: () => Promise<T>,
): Promise<T | null> {
  await lock();
  const target = await findTarget();
  if (!target) return null;
  if (
    target.role === "owner" &&
    target.isActive &&
    removesOwner(target) &&
    !(await hasOtherActiveOwner())
  ) {
    throw new LastActiveOwnerError();
  }
  return mutate();
}

export async function requireOwner(req: Request, res: Response): Promise<boolean> {
  if (!(await validateSecureAdminSession(req))) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  const session = getSecureAdminSession(req);
  if (!session?.email) return true;
  const [user] = await db
    .select({ role: adminUsersTable.role, isActive: adminUsersTable.isActive, sessionVersion: adminUsersTable.sessionVersion })
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, session.email))
    .limit(1);
  if (!user?.isActive || user.role !== "owner" || user.sessionVersion !== session.sessionVersion) {
    res.status(403).json({ error: "Owner access required" });
    return false;
  }
  return true;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(derived, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function isValidRole(role: unknown): role is (typeof ADMIN_ROLES)[number] {
  return typeof role === "string" && (ADMIN_ROLES as readonly string[]).includes(role);
}

function userToResponse(u: typeof adminUsersTable.$inferSelect) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
  };
}

router.get("/admin/users", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireOwner(req, res))) return;
  try {
    const users = await db.select().from(adminUsersTable).orderBy(desc(adminUsersTable.createdAt));
    res.json(users.map(userToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list admin users");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/users", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireOwner(req, res))) return;
  const { email, name, password, role } = req.body as { email?: string; name?: string; password?: string; role?: string };
  if (!email || !name || !password) {
    res.status(400).json({ error: "email, name and password are required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }
  const finalRole = isValidRole(role) ? role : "viewer";
  try {
    const [existing] = await db.select({ id: adminUsersTable.id }).from(adminUsersTable).where(eq(adminUsersTable.email, email.toLowerCase())).limit(1);
    if (existing) {
      res.status(409).json({ error: "An admin with that email already exists" });
      return;
    }
    const [created] = await db
      .insert(adminUsersTable)
      .values({ email: email.toLowerCase(), name, passwordHash: hashPassword(password), role: finalRole })
      .returning();
    res.status(201).json(userToResponse(created));
  } catch (err) {
    req.log.error({ err }, "Failed to create admin user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/users/:id", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireOwner(req, res))) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const { name, role, isActive, password } = req.body as Partial<{ name: string; role: string; isActive: boolean; password: string }>;
  const updates: Partial<typeof adminUsersTable.$inferInsert> = {};
  let revokeSessions = false;
  if (name !== undefined) updates.name = name;
  if (isActive !== undefined) updates.isActive = isActive;
  if (role !== undefined) {
    if (!isValidRole(role)) { res.status(400).json({ error: "Invalid role" }); return; }
    updates.role = role;
  }
  if (password !== undefined) {
    if (password.length < 8) { res.status(400).json({ error: "Password must be at least 8 characters" }); return; }
    updates.passwordHash = hashPassword(password);
    revokeSessions = true;
  }
  if (isActive === false) {
    revokeSessions = true;
  }
  try {
    const updated = await db.transaction(async (tx) => protectLastActiveOwner(
      async () => { await tx.execute(sql`SELECT pg_advisory_xact_lock(${OWNER_MUTATION_LOCK_KEY})`); },
      async () => {
        const [target] = await tx
          .select({ role: adminUsersTable.role, isActive: adminUsersTable.isActive })
          .from(adminUsersTable)
          .where(eq(adminUsersTable.id, id))
          .limit(1);
        return target ?? null;
      },
      async () => {
        const [otherOwner] = await tx
          .select({ id: adminUsersTable.id })
          .from(adminUsersTable)
          .where(and(
            eq(adminUsersTable.role, "owner"),
            eq(adminUsersTable.isActive, true),
            ne(adminUsersTable.id, id),
          ))
          .limit(1);
        return Boolean(otherOwner);
      },
      (target) => (role !== undefined && role !== "owner") || (isActive === false && target.isActive),
      async () => {
        const [result] = await tx
          .update(adminUsersTable)
          .set({
            ...updates,
            ...(revokeSessions ? { sessionVersion: sql`${adminUsersTable.sessionVersion} + 1` } : {}),
          })
          .where(eq(adminUsersTable.id, id))
          .returning();
        return result;
      },
    ));
    if (!updated) { res.status(404).json({ error: "Admin user not found" }); return; }
    res.json(userToResponse(updated));
  } catch (err) {
    if (err instanceof LastActiveOwnerError) {
      res.status(409).json({ error: err.message });
      return;
    }
    req.log.error({ err }, "Failed to update admin user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/users/:id", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireOwner(req, res))) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const deleted = await db.transaction(async (tx) => protectLastActiveOwner(
      async () => { await tx.execute(sql`SELECT pg_advisory_xact_lock(${OWNER_MUTATION_LOCK_KEY})`); },
      async () => {
        const [target] = await tx
          .select({ role: adminUsersTable.role, isActive: adminUsersTable.isActive })
          .from(adminUsersTable)
          .where(eq(adminUsersTable.id, id))
          .limit(1);
        return target ?? null;
      },
      async () => {
        const [otherOwner] = await tx
          .select({ id: adminUsersTable.id })
          .from(adminUsersTable)
          .where(and(
            eq(adminUsersTable.role, "owner"),
            eq(adminUsersTable.isActive, true),
            ne(adminUsersTable.id, id),
          ))
          .limit(1);
        return Boolean(otherOwner);
      },
      () => true,
      async () => {
        const [result] = await tx.delete(adminUsersTable).where(eq(adminUsersTable.id, id)).returning();
        return result;
      },
    ));
    if (!deleted) { res.status(404).json({ error: "Admin user not found" }); return; }
    res.status(204).send();
  } catch (err) {
    if (err instanceof LastActiveOwnerError) {
      res.status(409).json({ error: err.message });
      return;
    }
    req.log.error({ err }, "Failed to delete admin user");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
