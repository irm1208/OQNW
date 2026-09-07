# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-mobile-published.spec.ts >> published admin keeps mounted mobile routing, assets, table, and dialog working
- Location: tests/admin-mobile/admin-mobile-published.spec.ts:5:5

# Error details

```
Error: {"error":"Create an active owner account before using development access."}

expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e10]: OmniQure Ops
      - generic [ref=e11]: Sign in to the admin console
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]: Email (blank for initial owner or MFA recovery)
        - textbox "owner@omniqure.com" [active] [ref=e16]
      - generic [ref=e17]:
        - text: Password
        - textbox "Admin password" [ref=e18]
      - button "Continue" [disabled]
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | const ADMIN_BASE = "/imtheonlyadmin";
  4  | 
  5  | test("published admin keeps mounted mobile routing, assets, table, and dialog working", async ({
  6  |   page,
  7  | }) => {
  8  |   const failedAssets: string[] = [];
  9  |   page.on("response", (response) => {
  10 |     const url = new URL(response.url());
  11 |     if (
  12 |       url.origin === "http://127.0.0.1:5003" &&
  13 |       url.pathname.startsWith(`${ADMIN_BASE}/`) &&
  14 |       /\.(?:css|js|ico|png|svg)(?:\?|$)/.test(url.pathname + url.search) &&
  15 |       response.status() >= 400
  16 |     ) {
  17 |       failedAssets.push(`${response.status()} ${url.pathname}`);
  18 |     }
  19 |   });
  20 | 
  21 |   await page.goto(`${ADMIN_BASE}/products`);
  22 |   await expect(page).toHaveURL(`${ADMIN_BASE}/login`);
  23 |   await expect(page.getByText("OmniQure Ops")).toBeVisible();
  24 | 
  25 |   const loginResponse = await page.request.post(
  26 |     "/api/admin/auth/development-login",
  27 |   );
> 28 |   expect(loginResponse.ok(), await loginResponse.text()).toBeTruthy();
     |                                                          ^ Error: {"error":"Create an active owner account before using development access."}
  29 | 
  30 |   await page.goto(`${ADMIN_BASE}/products`);
  31 |   await expect(page).toHaveURL(`${ADMIN_BASE}/products`);
  32 |   await expect(page.locator("[data-admin-content]")).toBeVisible();
  33 |   await expect(page.locator(".admin-page table")).toBeVisible();
  34 | 
  35 |   await page.getByRole("button", { name: "Open admin navigation" }).click();
  36 |   const navigation = page.getByRole("dialog", { name: "Admin navigation" });
  37 |   await expect(navigation).toBeVisible();
  38 |   await expect(navigation.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
  39 |     "href",
  40 |     `${ADMIN_BASE}/dashboard`,
  41 |   );
  42 |   await page.keyboard.press("Escape");
  43 | 
  44 |   await page.getByRole("button", { name: "Add Product" }).click();
  45 |   const productDialog = page.getByRole("dialog").last();
  46 |   await expect(productDialog).toBeVisible();
  47 |   await expect(
  48 |     productDialog.getByRole("button", { name: /Cancel|Close/i }).first(),
  49 |   ).toBeVisible();
  50 |   await page.keyboard.press("Escape");
  51 |   await expect(productDialog).toBeHidden();
  52 | 
  53 |   expect(failedAssets).toEqual([]);
  54 | });
```