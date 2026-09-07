# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-desktop.spec.ts >> declared admin routes stay covered by the desktop regression suite
- Location: tests/admin-desktop/admin-desktop.spec.ts:81:5

# Error details

```
Error: {"error":"Create an active owner account before using development access."}

expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { expect, type Page } from "@playwright/test";
  2  | import { readFile } from "node:fs/promises";
  3  | 
  4  | export const STATIC_ADMIN_ROUTES = [
  5  |   "/dashboard",
  6  |   "/alerts",
  7  |   "/fraud",
  8  |   "/orders",
  9  |   "/wholesale",
  10 |   "/fulfillment",
  11 |   "/crypto-payments",
  12 |   "/customers",
  13 |   "/referrals",
  14 |   "/affiliates",
  15 |   "/products",
  16 |   "/discounts",
  17 |   "/returns",
  18 |   "/reviews",
  19 |   "/abandoned-carts",
  20 |   "/email-log",
  21 |   "/loyalty",
  22 |   "/stock-alerts",
  23 |   "/shipping",
  24 |   "/refunds",
  25 |   "/blog",
  26 |   "/blocked-ips",
  27 |   "/public-traffic",
  28 |   "/reports",
  29 |   "/newsletter",
  30 |   "/settings",
  31 |   "/users",
  32 |   "/security-activity",
  33 | ] as const;
  34 | 
  35 | export const DYNAMIC_ADMIN_ROUTE_PATTERNS = ["/orders/:id", "/customers/:id"] as const;
  36 | 
  37 | export async function authenticateAdmin(page: Page) {
  38 |   const response = await page.request.post("/api/admin/auth/development-login");
> 39 |   expect(response.ok(), await response.text()).toBeTruthy();
     |                                                ^ Error: {"error":"Create an active owner account before using development access."}
  40 |   await page.goto("/dashboard");
  41 |   await expect(page.locator("[data-admin-content]")).toBeVisible();
  42 | }
  43 | 
  44 | export async function expectDeclaredAdminRoutes() {
  45 |   const appSource = await readFile("artifacts/admin-panel/src/App.tsx", "utf8");
  46 |   const declared = [...appSource.matchAll(/<Route path="([^"]+)"/g)]
  47 |     .map((match) => match[1])
  48 |     .filter((route) => route !== "/login" && route !== "/")
  49 |     .sort();
  50 | 
  51 |   expect(declared).toEqual([...STATIC_ADMIN_ROUTES, ...DYNAMIC_ADMIN_ROUTE_PATTERNS].sort());
  52 | }
```