import type { NextFunction, Request, Response } from "express";
import { db } from "@workspace/db";
import { blockedIpsTable, publicTrafficEventsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export type PublicResourceKind = "catalogue" | "blog" | "image" | "sitemap";

type TrafficState = {
  requestCount: number;
  uniquePathCount: number;
  blockedUntil: Date | null;
};

type TrafficDecision = {
  allowed: boolean;
  status: number;
  retryAfterSeconds?: number;
  reason?: string;
  state?: TrafficState;
};

const LIMITS: Record<PublicResourceKind, { requestsPerMinute: number; uniquePaths: number }> = {
  catalogue: { requestsPerMinute: 90, uniquePaths: 80 },
  blog: { requestsPerMinute: 45, uniquePaths: 40 },
  image: { requestsPerMinute: 180, uniquePaths: 160 },
  sitemap: { requestsPerMinute: 12, uniquePaths: 4 },
};

const TEMPORARY_BLOCK_MS = 15 * 60 * 1000;
const MAX_PATH_LENGTH = 300;
const MAX_USER_AGENT_LENGTH = 300;

// These agents are explicitly allowed to crawl public content. User agents are
// still spoofable, so this is an availability exemption, not an identity check.
const SAFE_AGENT_PATTERN =
  /googlebot|google-inspectiontool|adsbot-google|bingbot|duckduckbot|applebot|yandex(bot)?|baiduspider|lighthouse|pagespeed|wave|axe-core|nvda|jaws|voiceover/i;

const AUTOMATION_AGENT_PATTERN =
  /headless|phantom|selenium|playwright|puppeteer|scrapy|curl\/|wget\/|python-requests|axios\/|go-http-client|java\/|libwww-perl/i;

function safeHeader(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

export function resourceKindForPath(path: string): PublicResourceKind | null {
  const pathname = path.split("?")[0];
  if (pathname === "/sitemap.xml" || pathname === "/api/sitemap.xml") return "sitemap";
  if (/^\/api\/catalogue-assets\/.+\.(?:avif|gif|jpe?g|png|svg|webp|ico)$/i.test(pathname)) return "image";
  if (/^\/api\/products(?:\/[^/]+)?(?:\/related)?$/.test(pathname)) return "catalogue";
  if (/^\/api\/blog\/posts(?:\/[^/]+)?$/.test(pathname)) return "blog";
  if (/\.(?:avif|gif|jpe?g|png|svg|webp|ico)$/i.test(pathname)) return "image";
  return null;
}

export function isKnownSafeAgent(userAgent: string): boolean {
  return SAFE_AGENT_PATTERN.test(userAgent);
}

export function isAutomatedAgent(userAgent: string): boolean {
  return AUTOMATION_AGENT_PATTERN.test(userAgent) || !/mozilla|chrome|safari|firefox|edg\//i.test(userAgent);
}

export function shouldStartTemporaryBlock(blockedUntil: Date | null, now = Date.now()): boolean {
  return !blockedUntil || blockedUntil.getTime() <= now;
}

function normalizedClientIp(req: Request): string {
  // Express resolves this from the configured trusted proxy hop. Do not use the
  // first X-Forwarded-For value, which clients can prepend themselves.
  const ip = req.ip || req.socket?.remoteAddress;
  return ip && ip.length <= 100 ? ip : "unknown";
}

async function isBlocked(ip: string): Promise<boolean> {
  const [blocked] = await db
    .select({ ip: blockedIpsTable.ip })
    .from(blockedIpsTable)
    .where(eq(blockedIpsTable.ip, ip))
    .limit(1);
  return !!blocked;
}

async function recordTraffic(
  clientKey: string,
  ip: string,
  resourceKind: PublicResourceKind,
  path: string,
  userAgent: string,
): Promise<TrafficState> {
  const result = await db.execute(sql`
    INSERT INTO public_traffic_limits (
      client_key, ip, resource_kind, window_started_at, request_count,
      behavior_started_at, recent_paths, last_path, last_user_agent, updated_at
    )
    VALUES (
      ${clientKey}, ${ip}, ${resourceKind}, NOW(), 1,
      NOW(), ARRAY[${path}]::text[], ${path}, ${userAgent || null}, NOW()
    )
    ON CONFLICT (client_key) DO UPDATE SET
      ip = EXCLUDED.ip,
      resource_kind = EXCLUDED.resource_kind,
      window_started_at = CASE
        WHEN public_traffic_limits.window_started_at < NOW() - INTERVAL '1 minute'
        THEN NOW()
        ELSE public_traffic_limits.window_started_at
      END,
      request_count = CASE
        WHEN public_traffic_limits.window_started_at < NOW() - INTERVAL '1 minute'
        THEN 1
        ELSE public_traffic_limits.request_count + 1
      END,
      behavior_started_at = CASE
        WHEN public_traffic_limits.behavior_started_at < NOW() - INTERVAL '10 minutes'
        THEN NOW()
        ELSE public_traffic_limits.behavior_started_at
      END,
      recent_paths = CASE
        WHEN public_traffic_limits.behavior_started_at < NOW() - INTERVAL '10 minutes'
        THEN EXCLUDED.recent_paths
        ELSE ARRAY(
          SELECT DISTINCT path_value
          FROM unnest(public_traffic_limits.recent_paths || EXCLUDED.recent_paths) AS paths(path_value)
          LIMIT 201
        )
      END,
      last_path = EXCLUDED.last_path,
      last_user_agent = EXCLUDED.last_user_agent,
      updated_at = NOW()
    RETURNING request_count, cardinality(recent_paths) AS unique_path_count, blocked_until
  `);

  const row = result.rows[0] as {
    request_count: number | string;
    unique_path_count: number | string;
    blocked_until: Date | string | null;
  } | undefined;
  if (!row) throw new Error("Traffic limiter did not return a state");

  return {
    requestCount: Number(row.request_count),
    uniquePathCount: Number(row.unique_path_count),
    blockedUntil: row.blocked_until ? new Date(row.blocked_until) : null,
  };
}

async function logTrafficEvent(
  clientKey: string,
  ip: string,
  resourceKind: PublicResourceKind,
  path: string,
  userAgent: string,
  state: TrafficState,
  action: string,
  reason: string,
): Promise<void> {
  await db.insert(publicTrafficEventsTable).values({
    clientKey,
    ip,
    resourceKind,
    path,
    userAgent: userAgent || null,
    requestCount: state.requestCount,
    uniquePathCount: state.uniquePathCount,
    action,
    reason,
  });
}

async function applyTrafficDecision(
  req: Request,
  resourceKind: PublicResourceKind,
  pathOverride?: string,
): Promise<TrafficDecision> {
  const ip = normalizedClientIp(req);
  if (await isBlocked(ip)) {
    return { allowed: false, status: 403, reason: "manually_blocked" };
  }

  const userAgent = safeHeader(req.headers["user-agent"], MAX_USER_AGENT_LENGTH);
  const knownSafeAgent = isKnownSafeAgent(userAgent);

  const path = safeHeader(pathOverride ?? req.path, MAX_PATH_LENGTH) || "/";
  const clientKey = `${ip}:${resourceKind}`;
  const state = await recordTraffic(clientKey, ip, resourceKind, path, userAgent);
  if (state.blockedUntil && state.blockedUntil.getTime() > Date.now()) {
    return {
      allowed: false,
      status: 403,
      retryAfterSeconds: Math.max(1, Math.ceil((state.blockedUntil.getTime() - Date.now()) / 1000)),
      reason: "temporary_block",
      state,
    };
  }
  const baseLimit = LIMITS[resourceKind];
  const limit = knownSafeAgent
    ? {
        requestsPerMinute: baseLimit.requestsPerMinute * 10,
        uniquePaths: Math.max(baseLimit.uniquePaths * 10, 500),
      }
    : baseLimit;
  const overLimit =
    state.requestCount > limit.requestsPerMinute || state.uniquePathCount > limit.uniquePaths;

  if (!overLimit) {
    return { allowed: true, status: 200, state };
  }

  const automated = !knownSafeAgent && isAutomatedAgent(userAgent);
  const reason = state.requestCount > limit.requestsPerMinute
    ? "requests_per_minute"
    : "unique_paths";

  if (automated && shouldStartTemporaryBlock(state.blockedUntil)) {
    const blockedUntil = new Date(Date.now() + TEMPORARY_BLOCK_MS);
    await db.execute(sql`
      UPDATE public_traffic_limits
      SET blocked_until = ${blockedUntil}, updated_at = NOW()
      WHERE client_key = ${clientKey}
        AND (blocked_until IS NULL OR blocked_until < NOW())
    `);
    state.blockedUntil = blockedUntil;
  }

  await logTrafficEvent(
    clientKey,
    ip,
    resourceKind,
    path,
    userAgent,
    state,
    automated ? "temporary_block" : "throttled",
    reason,
  );

  return {
    allowed: false,
    status: automated ? 403 : 429,
    retryAfterSeconds: automated ? Math.ceil(TEMPORARY_BLOCK_MS / 1000) : 60,
    reason,
    state,
  };
}

export async function checkImageTraffic(req: Request, path: string): Promise<TrafficDecision> {
  try {
    return await applyTrafficDecision(req, "image", path);
  } catch (err) {
    req.log?.error({ err }, "Public image traffic protection failed open");
    return { allowed: true, status: 200 };
  }
}

export async function publicTrafficProtection(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (req.method !== "GET" && req.method !== "HEAD") {
    next();
    return;
  }

  const resourceKind = resourceKindForPath(req.originalUrl || req.path);
  if (!resourceKind || req.path === "/api/traffic/image") {
    next();
    return;
  }

  try {
    const decision = await applyTrafficDecision(req, resourceKind);
    if (decision.allowed) {
      if (decision.state) {
        const limit = LIMITS[resourceKind].requestsPerMinute;
        res.setHeader("X-RateLimit-Limit", String(limit));
        res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - decision.state.requestCount)));
      }
      next();
      return;
    }

    if (decision.retryAfterSeconds) res.setHeader("Retry-After", String(decision.retryAfterSeconds));
    res.status(decision.status).json({
      error: decision.status === 403 ? "Access denied." : "Too many public requests. Please retry shortly.",
    });
  } catch (err) {
    // A limiter outage must not take the catalogue or checkout API offline.
    req.log?.error({ err, resourceKind }, "Public traffic protection failed open");
    next();
  }
}

export { LIMITS };