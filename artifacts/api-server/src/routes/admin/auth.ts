import { Router } from "express";
import type { Request, Response } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "omniqure-admin-2024";
const SESSION_COOKIE = "admin_session";
const SESSION_VALUE = "authenticated";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

router.post("/admin/auth/login", async (req: Request, res: Response): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { password } = parsed.data;
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
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
