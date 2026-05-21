import type { Request } from "express";

export function getClientIp(req: Request): string | null {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? null;
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  );
}

export async function lookupCountry(ip: string): Promise<string | null> {
  if (!ip || isPrivateIp(ip)) return null;
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { countryCode?: string };
    return typeof data.countryCode === "string" && data.countryCode.length === 2
      ? data.countryCode
      : null;
  } catch {
    return null;
  }
}
