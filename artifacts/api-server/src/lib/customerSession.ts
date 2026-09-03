import crypto from "crypto";
import type { Request, Response } from "express";
import { requiredSecret } from "./securityConfig";

const SESSION_SECRET = requiredSecret("SESSION_SECRET", "omniqure-cust-session-development-only");
const CUSTOMER_COOKIE = "customer_session";

export function verifyCustomerSessionToken(token: string | undefined): number | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const supplied = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)) return null;
  const customerId = Number.parseInt(payload, 10);
  return Number.isInteger(customerId) && customerId > 0 ? customerId : null;
}

export function requireCustomerSession(req: Request, res: Response): number | null {
  const customerId = verifyCustomerSessionToken(req.cookies?.[CUSTOMER_COOKIE] as string | undefined);
  if (customerId) return customerId;
  res.clearCookie(CUSTOMER_COOKIE, { path: "/" });
  res.status(401).json({ error: "Please sign in to continue" });
  return null;
}