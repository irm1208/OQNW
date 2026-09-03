import crypto from "crypto";
import { requiredSecret } from "./securityConfig";

export const AFFILIATE_ATTRIBUTION_COOKIE = "affiliate_attribution";

export interface AffiliateAttributionToken {
  partnerId: number;
  trackingCode: string;
  clickedAt: Date;
}

const SECRET = requiredSecret("SESSION_SECRET", "omniqure-affiliate-development-only");

function signature(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function createAffiliateAttributionToken(partnerId: number, trackingCode: string, clickedAt = new Date()): string {
  const payload = Buffer.from(JSON.stringify({
    partnerId,
    trackingCode,
    clickedAt: clickedAt.toISOString(),
  })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifyAffiliateAttributionToken(token: string | undefined): AffiliateAttributionToken | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const supplied = token.slice(dot + 1);
  const expected = signature(payload);
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Record<string, unknown>;
    const partnerId = Number(parsed.partnerId);
    const trackingCode = typeof parsed.trackingCode === "string" ? parsed.trackingCode : "";
    const clickedAt = typeof parsed.clickedAt === "string" ? new Date(parsed.clickedAt) : new Date(NaN);
    if (!Number.isInteger(partnerId) || partnerId < 1 || !trackingCode || Number.isNaN(clickedAt.getTime())) return null;
    return { partnerId, trackingCode, clickedAt };
  } catch {
    return null;
  }
}