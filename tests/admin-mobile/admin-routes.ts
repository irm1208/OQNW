import { expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

export const STATIC_ADMIN_ROUTES = [
  "/dashboard",
  "/alerts",
  "/fraud",
  "/orders",
  "/wholesale",
  "/fulfillment",
  "/crypto-payments",
  "/customers",
  "/referrals",
  "/affiliates",
  "/products",
  "/discounts",
  "/returns",
  "/reviews",
  "/abandoned-carts",
  "/email-log",
  "/loyalty",
  "/stock-alerts",
  "/shipping",
  "/refunds",
  "/blog",
  "/blocked-ips",
  "/public-traffic",
  "/reports",
  "/newsletter",
  "/settings",
  "/users",
  "/security-activity",
] as const;

export const DYNAMIC_ADMIN_ROUTE_PATTERNS = ["/orders/:id", "/customers/:id"] as const;

export async function authenticateAdmin(page: Page) {
  const response = await page.request.post("/api/admin/auth/development-login");
  expect(response.ok(), await response.text()).toBeTruthy();
  await page.goto("/dashboard");
  await expect(page.locator("[data-admin-content]")).toBeVisible();
}

export async function expectDeclaredAdminRoutes() {
  const appSource = await readFile("artifacts/admin-panel/src/App.tsx", "utf8");
  const declared = [...appSource.matchAll(/<Route path="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((route) => route !== "/login" && route !== "/")
    .sort();

  expect(declared).toEqual([...STATIC_ADMIN_ROUTES, ...DYNAMIC_ADMIN_ROUTE_PATTERNS].sort());
}