import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { AdminLoginBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  adminAuditEventsTable,
  adminAuthChallengesTable,
  adminLoginAttemptsTable,
  adminRecoveryCodesTable,
  adminUsersTable,
  blockedIpsTable,
} from "@workspace/db/schema";
import { and, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { verifyPassword } from "./users";
import { createWallidTestCheckoutToken } from "../../lib/wallidTestCheckout";
import { createCryptoTestCheckoutToken } from "../../lib/cryptoTestCheckout";
import { getPublicCryptoPaymentOptions } from "../../lib/crypto-payments";
import { requiredSecret } from "../../lib/securityConfig";
import type { AdminRole } from "@workspace/db";

const router = Router();

const ADMIN_PASSWORD = requiredSecret("ADMIN_PASSWORD", "omniqure-admin-development-only");
const SESSION_SECRET = requiredSecret("SESSION_SECRET", "omniqure-admin-session-development-only");
const SESSION_COOKIE = "admin_session";
const SECURE_SESSION_COOKIE = "admin_secure_session";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const RECENT_AUTH_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 30 * 60 * 1000;
const MFA_CHALLENGE_MS = 5 * 60 * 1000;

function developmentAdminAccessEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    Boolean(process.env.REPL_ID) &&
    !process.env.REPLIT_DEPLOYMENT
  );
}

interface SecureAdminSession {
  email: string | null;
  authAt: number;
  sessionVersion: number;
}

export interface AdminRecoveryState {
  role: string;
  mfaEnabled: boolean;
}

export type SharedRecoveryDecision = "bootstrap" | "enroll-owner" | "denied";

export function sharedRecoveryDecision(activeAdmins: readonly AdminRecoveryState[]): SharedRecoveryDecision {
  if (activeAdmins.length === 0) return "bootstrap";
  if (
    activeAdmins.length === 1 &&
    activeAdmins[0].role === "owner" &&
    !activeAdmins[0].mfaEnabled
  ) {
    return "enroll-owner";
  }
  return "denied";
}

export function sharedOwnerSessionAllowed(activeAdmins: readonly AdminRecoveryState[]): boolean {
  return activeAdmins.length === 0;
}

function signPayload(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

export function createSecureAdminSessionValue(email: string | null, sessionVersion = 0): string {
  const expiresAt = Date.now() + COOKIE_MAX_AGE;
  const authAt = Date.now();
  const encodedEmail = Buffer.from(email ?? "", "utf8").toString("base64url");
  const payload = `admin:${expiresAt}:${authAt}:${sessionVersion}:${encodedEmail}`;
  return `${payload}:${signPayload(payload)}`;
}

function parseSecureAdminSession(req: Request): SecureAdminSession | null {
  const value = req.cookies?.[SECURE_SESSION_COOKIE];
  if (typeof value !== "string") return null;
  const [role, expires, authAt, sessionVersion, encodedEmail, signature, ...extra] = value.split(":");
  if (
    role !== "admin" ||
    !/^\d+$/.test(expires) ||
    !/^\d+$/.test(authAt) ||
    !/^\d+$/.test(sessionVersion) ||
    encodedEmail === undefined ||
    !signature ||
    extra.length > 0 ||
    Number(expires) < Date.now()
  ) {
    return null;
  }
  const payload = `${role}:${expires}:${authAt}:${sessionVersion}:${encodedEmail}`;
  const expected = signPayload(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const decodedEmail = Buffer.from(encodedEmail, "base64url").toString("utf8");
    return { email: decodedEmail || null, authAt: Number(authAt), sessionVersion: Number(sessionVersion) };
  } catch {
    return null;
  }
}

export function hasSecureAdminSession(req: Request): boolean {
  return parseSecureAdminSession(req) !== null;
}

export function isRecentSecureAdminSession(req: Request): boolean {
  const session = parseSecureAdminSession(req);
  return session !== null && Date.now() - session.authAt <= RECENT_AUTH_MS;
}

export async function validateSecureAdminSession(req: Request): Promise<boolean> {
  const session = parseSecureAdminSession(req);
  if (!session) return false;
  if (!session.email) {
    const activeAdmins = await db
      .select({ role: adminUsersTable.role, mfaEnabled: adminUsersTable.mfaEnabled })
      .from(adminUsersTable)
      .where(eq(adminUsersTable.isActive, true))
      .limit(1);
    return sharedOwnerSessionAllowed(activeAdmins);
  }
  const [user] = await db
    .select({ isActive: adminUsersTable.isActive, sessionVersion: adminUsersTable.sessionVersion })
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, session.email))
    .limit(1);
  return Boolean(user?.isActive && user.sessionVersion === session.sessionVersion);
}

export async function enforceSecureAdminSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!(await validateSecureAdminSession(req))) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (
    ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
    !(req.method === "POST" && /^\/alerts\/[^/]+\/read$/.test(req.path)) &&
    !isRecentSecureAdminSession(req)
  ) {
    res.status(401).json({ error: "Recent authentication required", requiresRecentAuth: true });
    return;
  }
  res.locals.adminAuthenticated = true;
  res.locals.adminEmail = parseSecureAdminSession(req)?.email ?? null;
  next();
}

export function getSecureAdminSession(req: Request): SecureAdminSession | null {
  return parseSecureAdminSession(req);
}

function getClientIp(req: Request): string {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function encryptionKey(): Buffer {
  return createHash("sha256").update(SESSION_SECRET).digest();
}

function encryptMfaSecret(secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return `${iv.toString("base64url")}:${cipher.getAuthTag().toString("base64url")}:${encrypted.toString("base64url")}`;
}

function decryptMfaSecret(value: string): string | null {
  try {
    const [ivValue, tagValue, encryptedValue] = value.split(":");
    if (!ivValue || !tagValue || !encryptedValue) return null;
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivValue, "base64url"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(value: Buffer): string {
  let bits = 0;
  let buffer = 0;
  let output = "";
  for (const byte of value) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(buffer >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += BASE32_ALPHABET[(buffer << (5 - bits)) & 31];
  return output;
}

function base32Decode(value: string): Buffer | null {
  const normalized = value.toUpperCase().replace(/[\s=-]/g, "");
  let bits = 0;
  let buffer = 0;
  const output: number[] = [];
  for (const char of normalized) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index < 0) return null;
    buffer = (buffer << 5) | index;
    bits += 5;
    if (bits >= 8) {
      output.push((buffer >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

function verifyTotp(secret: string, suppliedCode: string): boolean {
  const key = base32Decode(secret);
  const code = suppliedCode.replace(/\s/g, "");
  if (!key || !/^\d{6}$/.test(code)) return false;
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (const offset of [-1, 0, 1]) {
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigInt64BE(BigInt(counter + offset));
    const digest = createHmac("sha1", key).update(counterBuffer).digest();
    const start = digest[digest.length - 1] & 15;
    const value = ((digest[start] & 127) << 24) |
      (digest[start + 1] << 16) |
      (digest[start + 2] << 8) |
      digest[start + 3];
    const expected = String(value % 1_000_000).padStart(6, "0");
    if (timingSafeEqual(Buffer.from(expected), Buffer.from(code))) return true;
  }
  return false;
}

function makeRecoveryCode(): string {
  return randomBytes(5).toString("hex").toUpperCase();
}

export async function recordAdminAudit(
  req: Request,
  eventType: string,
  success: boolean,
  details: { adminUserId?: number | null; email?: string | null; metadata?: Record<string, unknown> } = {},
): Promise<void> {
  try {
    await db.insert(adminAuditEventsTable).values({
      eventType,
      adminUserId: details.adminUserId ?? null,
      email: details.email ?? null,
      ip: getClientIp(req),
      userAgent: req.get("user-agent")?.slice(0, 500) ?? null,
      requestId: String(req.id),
      success,
      metadata: details.metadata ?? null,
    });
  } catch (err) {
    req.log.error({ err, eventType }, "Failed to write admin security audit event");
  }
}

type AuditTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type AdminAuditDetails = { metadata?: Record<string, unknown> };
type AdminAuditActor = { id: number | null; email: string | null };

export function strictAdminAuditValues(
  req: Request,
  actor: AdminAuditActor,
  eventType: string,
  success: boolean,
  details: AdminAuditDetails = {},
) {
  return {
    eventType,
    adminUserId: actor.id,
    email: actor.email,
    ip: getClientIp(req),
    userAgent: req.get("user-agent")?.slice(0, 500) ?? null,
    requestId: String(req.id),
    success,
    metadata: details.metadata ?? null,
  };
}

async function auditActor(tx: AuditTransaction, req: Request): Promise<AdminAuditActor> {
  const session = parseSecureAdminSession(req);
  if (!session?.email) return { id: null, email: null };
  const [actor] = await tx
    .select({ id: adminUsersTable.id, email: adminUsersTable.email })
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, session.email))
    .limit(1);
  if (!actor) throw new Error("Authenticated admin actor is no longer available");
  return actor;
}

/**
 * Writes a security-sensitive audit event on the caller's transaction.
 * Unlike recordAdminAudit, errors intentionally propagate so the protected
 * mutation and its audit record commit or roll back together.
 */
export async function recordStrictAdminAudit(
  tx: AuditTransaction,
  req: Request,
  eventType: string,
  success: boolean,
  details: AdminAuditDetails = {},
): Promise<void> {
  const actor = await auditActor(tx, req);
  await tx.insert(adminAuditEventsTable).values(strictAdminAuditValues(req, actor, eventType, success, details));
}

async function findLockout(ip: string) {
  const [record] = await db
    .select()
    .from(adminLoginAttemptsTable)
    .where(eq(adminLoginAttemptsTable.ip, ip))
    .limit(1);
  if (!record) return null;
  const now = new Date();
  if (record.lockedUntil && record.lockedUntil > now) return record;
  if (!record.lockedUntil && record.lastAttemptAt.getTime() + ATTEMPT_WINDOW_MS > now.getTime()) return record;
  return null;
}

async function recordFailedAttempt(ip: string): Promise<{ count: number; lockedUntil: Date | null }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - ATTEMPT_WINDOW_MS);
  const lockUntil = new Date(now.getTime() + LOCKOUT_MS);
  const freshOrExpired = sql`(${adminLoginAttemptsTable.lastAttemptAt} < ${windowStart} OR (${adminLoginAttemptsTable.lockedUntil} IS NOT NULL AND ${adminLoginAttemptsTable.lockedUntil} < ${now}))`;
  const nextCount = sql<number>`CASE WHEN ${freshOrExpired} THEN 1 ELSE ${adminLoginAttemptsTable.failedAttempts} + 1 END`;
  const [record] = await db
    .insert(adminLoginAttemptsTable)
    .values({ ip, failedAttempts: 1, lastAttemptAt: now })
    .onConflictDoUpdate({
      target: adminLoginAttemptsTable.ip,
      set: {
        failedAttempts: nextCount,
        lastAttemptAt: now,
        lockedUntil: sql`CASE WHEN ${nextCount} >= ${MAX_ATTEMPTS} THEN ${lockUntil}::timestamptz ELSE NULL::timestamptz END`,
      },
    })
    .returning({ count: adminLoginAttemptsTable.failedAttempts, lockedUntil: adminLoginAttemptsTable.lockedUntil });
  return { count: record?.count ?? MAX_ATTEMPTS, lockedUntil: record?.lockedUntil ?? lockUntil };
}

async function clearFailedAttempts(ip: string): Promise<void> {
  await db.delete(adminLoginAttemptsTable).where(eq(adminLoginAttemptsTable.ip, ip));
}

async function respondToFailedLogin(req: Request, res: Response, email: string): Promise<void> {
  const { count, lockedUntil } = await recordFailedAttempt(getClientIp(req));
  const locked = count >= MAX_ATTEMPTS;
  await recordAdminAudit(req, locked ? "admin_login_lockout" : "admin_login_failed", false, {
    email: email || null,
    metadata: { attempts: count, locked },
  });
  if (locked) {
    const until = lockedUntil ?? new Date(Date.now() + LOCKOUT_MS);
    res.status(429).json({
      error: "Too many failed attempts. Access temporarily locked.",
      lockedUntil: until.getTime(),
      retryAfterSeconds: Math.max(1, Math.ceil((until.getTime() - Date.now()) / 1000)),
    });
    return;
  }
  res.status(401).json({
    error: "Invalid credentials",
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - count),
  });
}

function challengeTokenValue(kind: "mfa" | "enroll", userId: number): { token: string; expiresAt: Date } {
  const expiresAt = new Date(Date.now() + MFA_CHALLENGE_MS);
  const payload = `${kind}:${expiresAt.getTime()}:${userId}:${randomBytes(18).toString("base64url")}`;
  return { token: `${payload}:${signPayload(payload)}`, expiresAt };
}

function parseChallengeToken(value: string): { kind: "mfa" | "enroll"; userId: number; expiresAt: number } | null {
  const [kind, expires, userId, nonce, signature, ...extra] = value.split(":");
  if ((kind !== "mfa" && kind !== "enroll") || !/^\d+$/.test(expires) || !/^\d+$/.test(userId) || !nonce || !signature || extra.length) return null;
  if (Number(expires) < Date.now()) return null;
  const payload = `${kind}:${expires}:${userId}:${nonce}`;
  const expected = signPayload(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return { kind, userId: Number(userId), expiresAt: Number(expires) };
}

async function currentAdminUser(req: Request) {
  const session = parseSecureAdminSession(req);
  if (!session?.email) return null;
  const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, session.email)).limit(1);
  return user && user.isActive && user.sessionVersion === session.sessionVersion ? user : null;
}

/**
 * Resolves the effective role from the signed session, rather than trusting a
 * client-provided claim. The no-email recovery session is intentionally an
 * owner session while the shared-owner bootstrap is available.
 */
export async function getAdminRole(req: Request): Promise<AdminRole | null> {
  if (!(await validateSecureAdminSession(req))) return null;
  const session = parseSecureAdminSession(req);
  if (!session?.email) return "owner";
  const [user] = await db
    .select({ role: adminUsersTable.role })
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, session.email))
    .limit(1);
  return user && (user.role === "owner" || user.role === "manager" || user.role === "viewer")
    ? user.role
    : null;
}

const OWNER_ONLY_ADMIN_PATHS = [
  /^\/users(?:\/|$)/,
  /^\/settings(?:\/|$)/,
  /^\/security(?:\/|$)/,
  /^\/blocked-ips(?:\/|$)/,
  /^\/public-traffic(?:\/|$)/,
  /^\/webhooks(?:\/|$)/,
  /^\/shipping(?:\/|$)/,
  /^\/tax(?:\/|$)/,
  /^\/test-payments(?:\/|$)/,
  /^\/customers\/[^/]+\/gdpr-erase$/,
];

function isReadOnlyMethod(method: string): boolean {
  return method === "GET" || method === "HEAD" || method === "OPTIONS";
}

export function adminRoleAllowsRequest(role: AdminRole, path: string, method: string): boolean {
  if (role === "owner") return true;
  if (role === "viewer") return isReadOnlyMethod(method);
  return !OWNER_ONLY_ADMIN_PATHS.some((ownerOnlyPath) => ownerOnlyPath.test(path));
}

/**
 * Global policy for every non-auth /admin route. Route checks can remain as
 * defense-in-depth, but must not be relied on for role enforcement.
 */
export async function enforceAdminAuthorization(req: Request, res: Response, next: NextFunction): Promise<void> {
  const role = await getAdminRole(req);
  if (!role) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (!adminRoleAllowsRequest(role, req.path, req.method) && role === "viewer") {
    res.status(403).json({ error: "Viewer access is read-only" });
    return;
  }
  if (!adminRoleAllowsRequest(role, req.path, req.method)) {
    res.status(403).json({ error: "Owner access required" });
    return;
  }
  res.locals.adminRole = role;
  next();
}

export async function requireRecentAdminSession(req: Request, res: Response): Promise<boolean> {
  if (!(await validateSecureAdminSession(req)) || !isRecentSecureAdminSession(req)) {
    res.status(401).json({ error: "Recent authentication required", requiresRecentAuth: true });
    return false;
  }
  return true;
}

router.post("/admin/auth/login", async (req: Request, res: Response): Promise<void> => {
  const ip = getClientIp(req);
  const [blocked] = await db.select({ ip: blockedIpsTable.ip }).from(blockedIpsTable).where(eq(blockedIpsTable.ip, ip)).limit(1);
  if (blocked) {
    await recordAdminAudit(req, "admin_login_blocked_ip", false);
    res.status(403).json({ error: "Access denied." });
    return;
  }

  const lockout = await findLockout(ip);
  if (lockout?.lockedUntil && lockout.lockedUntil > new Date()) {
    res.status(429).json({
      error: "Too many failed attempts. Access temporarily locked.",
      lockedUntil: lockout.lockedUntil.getTime(),
      retryAfterSeconds: Math.max(1, Math.ceil((lockout.lockedUntil.getTime() - Date.now()) / 1000)),
    });
    return;
  }

  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { password, email: suppliedEmail, challengeToken, mfaCode, recoveryCode } = parsed.data;
  const email = typeof suppliedEmail === "string" ? suppliedEmail.toLowerCase().trim() : "";

  if (challengeToken) {
    const challenge = parseChallengeToken(challengeToken);
    if (!challenge) {
      await respondToFailedLogin(req, res, email);
      return;
    }
    const challengeHash = hashValue(challengeToken);
    const [storedChallenge] = await db
      .select()
      .from(adminAuthChallengesTable)
      .where(and(eq(adminAuthChallengesTable.tokenHash, challengeHash), isNull(adminAuthChallengesTable.usedAt), gt(adminAuthChallengesTable.expiresAt, new Date())))
      .limit(1);
    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, challenge.userId)).limit(1);
    const enrollmentChallenge = challenge.kind === "enroll";
    const challengeMatchesAccount = enrollmentChallenge
      ? Boolean(user && !user.mfaEnabled && user.pendingMfaSecretEncrypted)
      : Boolean(user?.mfaEnabled && user.mfaSecretEncrypted);
    if (!storedChallenge || !user || !user.isActive || !challengeMatchesAccount || (email && email !== user.email)) {
      await respondToFailedLogin(req, res, email);
      return;
    }

    let recoveryUsed = false;
    let recoveryCodeId: number | null = null;
    const challengeSecret = enrollmentChallenge ? user.pendingMfaSecretEncrypted : user.mfaSecretEncrypted;
    let verified = typeof mfaCode === "string" && verifyTotp(
      challengeSecret ? decryptMfaSecret(challengeSecret) ?? "" : "",
      mfaCode,
    );
    if (!enrollmentChallenge && !verified && typeof recoveryCode === "string" && /^[A-Fa-f0-9]{10}$/.test(recoveryCode.replace(/\s/g, ""))) {
      const codeHash = hashValue(recoveryCode.replace(/\s/g, "").toUpperCase());
      const [availableCode] = await db
        .select({ id: adminRecoveryCodesTable.id })
        .from(adminRecoveryCodesTable)
        .where(and(eq(adminRecoveryCodesTable.adminUserId, user.id), eq(adminRecoveryCodesTable.codeHash, codeHash), isNull(adminRecoveryCodesTable.usedAt)))
        .limit(1);
      verified = Boolean(availableCode);
      recoveryUsed = verified;
      recoveryCodeId = availableCode?.id ?? null;
    }
    if (!verified) {
      await respondToFailedLogin(req, res, user.email);
      return;
    }

    const enrollmentRecoveryCodes = enrollmentChallenge ? Array.from({ length: 10 }, makeRecoveryCode) : [];
    try {
      await db.transaction(async (tx) => {
        const [claimedChallenge] = await tx
          .update(adminAuthChallengesTable)
          .set({ usedAt: new Date() })
          .where(and(eq(adminAuthChallengesTable.id, storedChallenge.id), isNull(adminAuthChallengesTable.usedAt)))
          .returning({ id: adminAuthChallengesTable.id });
        if (!claimedChallenge) throw new Error("MFA challenge already used");
        if (recoveryUsed) {
          const [claimedCode] = await tx
            .update(adminRecoveryCodesTable)
            .set({ usedAt: new Date() })
            .where(and(eq(adminRecoveryCodesTable.id, recoveryCodeId!), isNull(adminRecoveryCodesTable.usedAt)))
            .returning({ id: adminRecoveryCodesTable.id });
          if (!claimedCode) throw new Error("Recovery code already used");
        }
        if (enrollmentChallenge) {
          await tx.insert(adminRecoveryCodesTable).values(enrollmentRecoveryCodes.map((codeValue) => ({
            adminUserId: user.id,
            codeHash: hashValue(codeValue),
          })));
          await tx.update(adminUsersTable).set({
            mfaSecretEncrypted: user.pendingMfaSecretEncrypted,
            pendingMfaSecretEncrypted: null,
            mfaEnabled: true,
            mfaEnrolledAt: new Date(),
            mfaLastUsedAt: new Date(),
            lastLoginAt: new Date(),
            sessionVersion: sql`${adminUsersTable.sessionVersion} + 1`,
          }).where(eq(adminUsersTable.id, user.id));
        } else {
          await tx.update(adminUsersTable).set({ lastLoginAt: new Date(), mfaLastUsedAt: new Date() }).where(eq(adminUsersTable.id, user.id));
        }
        await tx.delete(adminLoginAttemptsTable).where(eq(adminLoginAttemptsTable.ip, ip));
        await tx.insert(adminAuditEventsTable).values({
          eventType: enrollmentChallenge ? "admin_mfa_enabled" : recoveryUsed ? "admin_recovery_code_used" : "admin_mfa_login_success",
          adminUserId: user.id,
          email: user.email,
          ip,
          userAgent: req.get("user-agent")?.slice(0, 500) ?? null,
          requestId: String(req.id),
          success: true,
          metadata: enrollmentChallenge ? { mandatoryEnrollment: true } : recoveryUsed ? { recoveryCodeUsed: true } : null,
        });
      });
    } catch {
      await respondToFailedLogin(req, res, user.email);
      return;
    }
    const sessionVersion = user.sessionVersion + (enrollmentChallenge ? 1 : 0);
    res.cookie(SECURE_SESSION_COOKIE, createSecureAdminSessionValue(user.email, sessionVersion), {
      httpOnly: true, maxAge: COOKIE_MAX_AGE, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie(SESSION_COOKIE);
    res.status(200).json({
      authenticated: true,
      ...(enrollmentChallenge ? { enrollmentCompleted: true, recoveryCodes: enrollmentRecoveryCodes } : {}),
    });
    return;
  }

  let user = null as Awaited<ReturnType<typeof currentAdminUser>>;
  if (email) {
    [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email)).limit(1);
  }
  const activeAdmins = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.isActive, true))
    .limit(2);
  const activeAdmin = activeAdmins[0];
  let bootstrapOwner = false;
  if (!email && password === ADMIN_PASSWORD) {
    const recoveryDecision = sharedRecoveryDecision(activeAdmins);
    bootstrapOwner = recoveryDecision === "bootstrap";
    if (recoveryDecision === "enroll-owner") {
      user = activeAdmin;
    }
  }
  const recoveringDisabledOwner = Boolean(
    user &&
    !user.isActive &&
    user.role === "owner" &&
    !activeAdmin &&
    verifyPassword(password, user.passwordHash),
  );
  const authed = Boolean(
    (user && user.isActive && (
      verifyPassword(password, user.passwordHash) ||
      (!email && password === ADMIN_PASSWORD && user.role === "owner" && !user.mfaEnabled)
    )) ||
    recoveringDisabledOwner ||
    bootstrapOwner,
  );
  if (!authed) {
    await respondToFailedLogin(req, res, email);
    return;
  }

  if (user && recoveringDisabledOwner) {
    const [reactivated] = await db
      .update(adminUsersTable)
      .set({
        isActive: true,
        sessionVersion: sql`${adminUsersTable.sessionVersion} + 1`,
      })
      .where(and(eq(adminUsersTable.id, user.id), eq(adminUsersTable.isActive, false)))
      .returning();
    if (!reactivated) {
      await respondToFailedLogin(req, res, email);
      return;
    }
    user = reactivated;
    await recordAdminAudit(req, "admin_owner_reactivated", true, {
      adminUserId: user.id,
      email: user.email,
      metadata: { reason: "no_active_admins" },
    });
  }

  if (user?.mfaEnabled) {
    const { token, expiresAt } = challengeTokenValue("mfa", user.id);
    await db.insert(adminAuthChallengesTable).values({
      adminUserId: user.id,
      tokenHash: hashValue(token),
      expiresAt,
    });
    await recordAdminAudit(req, "admin_mfa_challenge_issued", true, { adminUserId: user.id, email: user.email });
    res.status(200).json({ authenticated: false, mfaRequired: true, challengeToken: token });
    return;
  }

  if (user) {
    const secret = base32Encode(randomBytes(20));
    const { token, expiresAt } = challengeTokenValue("enroll", user.id);
    await db.transaction(async (tx) => {
      await tx.update(adminUsersTable).set({ pendingMfaSecretEncrypted: encryptMfaSecret(secret) }).where(eq(adminUsersTable.id, user.id));
      await tx.insert(adminAuthChallengesTable).values({
        adminUserId: user.id,
        tokenHash: hashValue(token),
        expiresAt,
      });
      await tx.insert(adminAuditEventsTable).values({
        eventType: "admin_mfa_enrollment_required",
        adminUserId: user.id,
        email: user.email,
        ip,
        userAgent: req.get("user-agent")?.slice(0, 500) ?? null,
        requestId: String(req.id),
        success: true,
      });
    });
    const label = encodeURIComponent(`OmniQure Admin:${user.email}`);
    res.status(200).json({
      authenticated: false,
      enrollmentRequired: true,
      challengeToken: token,
      secret,
      otpauthUri: `otpauth://totp/${label}?secret=${secret}&issuer=OmniQure`,
    });
    return;
  }

  await clearFailedAttempts(ip);
  await recordAdminAudit(req, "admin_bootstrap_login_success", true);
  res.cookie(SECURE_SESSION_COOKIE, createSecureAdminSessionValue(null, 0), {
    httpOnly: true, maxAge: COOKIE_MAX_AGE, sameSite: "lax", secure: process.env.NODE_ENV === "production",
  });
  res.clearCookie(SESSION_COOKIE);
  res.status(200).json({ authenticated: true });
});

router.post("/admin/auth/development-login", async (req: Request, res: Response): Promise<void> => {
  if (!developmentAdminAccessEnabled()) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const [owner] = await db
    .select()
    .from(adminUsersTable)
    .where(and(
      eq(adminUsersTable.isActive, true),
      eq(adminUsersTable.role, "owner"),
    ))
    .limit(1);

  if (!owner) {
    res.status(409).json({ error: "Create an active owner account before using development access." });
    return;
  }

  await recordAdminAudit(req, "admin_development_login", true, {
    adminUserId: owner.id,
    email: owner.email,
  });
  res.cookie(SECURE_SESSION_COOKIE, createSecureAdminSessionValue(owner.email, owner.sessionVersion), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: false,
  });
  res.clearCookie(SESSION_COOKIE);
  res.status(200).json({ authenticated: true });
});

router.post("/admin/auth/logout", async (req: Request, res: Response): Promise<void> => {
  const session = parseSecureAdminSession(req);
  if (session?.email && await validateSecureAdminSession(req)) {
    await db
      .update(adminUsersTable)
      .set({ sessionVersion: sql`${adminUsersTable.sessionVersion} + 1` })
      .where(eq(adminUsersTable.email, session.email));
  }
  await recordAdminAudit(req, "admin_logout", true, { email: session?.email ?? null });
  res.clearCookie(SESSION_COOKIE);
  res.clearCookie(SECURE_SESSION_COOKIE);
  res.status(204).send();
});

router.get("/admin/auth/mfa/status", async (req: Request, res: Response): Promise<void> => {
  if (!(await validateSecureAdminSession(req))) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const user = await currentAdminUser(req);
  res.json({ enabled: Boolean(user?.mfaEnabled), canEnroll: Boolean(user), email: user?.email ?? null });
});

router.post("/admin/auth/mfa/setup", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireRecentAdminSession(req, res))) return;
  const user = await currentAdminUser(req);
  if (!user) {
    res.status(403).json({ error: "Only an active admin user can enroll MFA." });
    return;
  }
  if (user.mfaEnabled) {
    res.status(409).json({ error: "MFA is already enabled." });
    return;
  }
  const secret = base32Encode(randomBytes(20));
  await db.update(adminUsersTable).set({ pendingMfaSecretEncrypted: encryptMfaSecret(secret) }).where(eq(adminUsersTable.id, user.id));
  await recordAdminAudit(req, "admin_mfa_setup_started", true, { adminUserId: user.id, email: user.email });
  const label = encodeURIComponent(`OmniQure Admin:${user.email}`);
  res.json({
    secret,
    otpauthUri: `otpauth://totp/${label}?secret=${secret}&issuer=OmniQure`,
  });
});

router.post("/admin/auth/mfa/enable", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireRecentAdminSession(req, res))) return;
  const user = await currentAdminUser(req);
  const code = typeof req.body?.code === "string" ? req.body.code : "";
  if (!user || !user.pendingMfaSecretEncrypted || !verifyTotp(decryptMfaSecret(user.pendingMfaSecretEncrypted) ?? "", code)) {
    await recordAdminAudit(req, "admin_mfa_enable_failed", false, { adminUserId: user?.id ?? null, email: user?.email ?? null });
    res.status(400).json({ error: "The verification code is invalid." });
    return;
  }
  const secret = user.pendingMfaSecretEncrypted;
  const recoveryCodes = Array.from({ length: 10 }, makeRecoveryCode);
  await db.transaction(async (tx) => {
    await tx.delete(adminRecoveryCodesTable).where(eq(adminRecoveryCodesTable.adminUserId, user.id));
    await tx.insert(adminRecoveryCodesTable).values(recoveryCodes.map((codeValue) => ({
      adminUserId: user.id,
      codeHash: hashValue(codeValue),
    })));
    await tx.update(adminUsersTable).set({
      mfaSecretEncrypted: secret,
      pendingMfaSecretEncrypted: null,
      mfaEnabled: true,
      mfaEnrolledAt: new Date(),
      sessionVersion: sql`${adminUsersTable.sessionVersion} + 1`,
    }).where(eq(adminUsersTable.id, user.id));
    await tx.insert(adminAuditEventsTable).values({
      eventType: "admin_mfa_enabled",
      adminUserId: user.id,
      email: user.email,
      ip: getClientIp(req),
      userAgent: req.get("user-agent")?.slice(0, 500) ?? null,
      requestId: String(req.id),
      success: true,
    });
  });
  res.cookie(SECURE_SESSION_COOKIE, createSecureAdminSessionValue(user.email, user.sessionVersion + 1), {
    httpOnly: true, maxAge: COOKIE_MAX_AGE, sameSite: "lax", secure: process.env.NODE_ENV === "production",
  });
  res.json({ enabled: true, recoveryCodes });
});

router.post("/admin/test-payments/session", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireRecentAdminSession(req, res))) return;
  if ((await getAdminRole(req)) !== "owner") {
    res.status(403).json({ error: "Owner access required" });
    return;
  }
  const testCheckoutSecret = process.env.SESSION_SECRET;
  if (!testCheckoutSecret) {
    res.status(503).json({ error: "Wallid test checkout is unavailable because secure session signing is not configured." });
    return;
  }
  const { token, expiresAt } = createWallidTestCheckoutToken(testCheckoutSecret);
  res.status(201).json({ checkoutPath: `/cart?wallidTest=${encodeURIComponent(token)}`, expiresAt, amountMinor: 100, currency: "GBP" });
});

router.post("/admin/test-payments/crypto-session", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireRecentAdminSession(req, res))) return;
  if ((await getAdminRole(req)) !== "owner") {
    res.status(403).json({ error: "Owner access required" });
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
    res.status(201).json({ checkoutPath: `/cart?cryptoTest=${encodeURIComponent(token)}`, expiresAt, amountMinor: 100, currency: "GBP" });
  } catch (err) {
    req.log.error({ err }, "Failed to create crypto test checkout");
    res.status(503).json({ error: "Crypto test checkout is temporarily unavailable." });
  }
});

router.get("/admin/auth/me", async (req: Request, res: Response): Promise<void> => {
  const session = parseSecureAdminSession(req);
  if (!session || !(await validateSecureAdminSession(req))) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (session.email) {
    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, session.email)).limit(1);
    if (user?.isActive && user.sessionVersion === session.sessionVersion) {
      res.status(200).json({
        authenticated: true,
        email: user.email,
        name: user.name,
        role: user.role,
        recentAuth: Date.now() - session.authAt <= RECENT_AUTH_MS,
        mfaEnabled: user.mfaEnabled,
      });
      return;
    }
    res.status(401).json({ error: "Admin account is no longer active" });
    return;
  }
  res.status(200).json({ authenticated: true, role: "owner", name: "Owner", recentAuth: Date.now() - session.authAt <= RECENT_AUTH_MS });
});

export default router;