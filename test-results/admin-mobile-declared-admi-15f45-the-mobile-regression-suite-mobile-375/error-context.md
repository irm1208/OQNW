# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-mobile.spec.ts >> declared admin routes stay covered by the mobile regression suite
- Location: tests/admin-mobile/admin-mobile.spec.ts:101:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 7

@@ -1,19 +1,24 @@
  Array [
    "/abandoned-carts",
    "/affiliates",
    "/alerts",
+   "/audit-history",
    "/blocked-ips",
    "/blog",
+   "/credits",
    "/crypto-payments",
+   "/customer-segments",
+   "/customer-segments/:id",
    "/customers",
    "/customers/:id",
    "/dashboard",
    "/discounts",
    "/email-log",
    "/fraud",
    "/fulfillment",
+   "/inventory-audit",
    "/loyalty",
    "/newsletter",
    "/orders",
    "/orders/:id",
    "/products",
@@ -25,8 +30,10 @@
    "/reviews",
    "/security-activity",
    "/settings",
    "/shipping",
    "/stock-alerts",
+   "/tax",
    "/users",
+   "/webhooks",
    "/wholesale",
  ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - button "Open admin navigation" [ref=e7]
          - img "OmniQure Admin" [ref=e8]
        - generic [ref=e9]:
          - button "Search" [ref=e11]
          - button "Notifications" [ref=e13]:
            - generic [ref=e14]: "17"
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]:
            - generic [ref=e20]:
              - heading "Overview" [level=2] [ref=e21]
              - generic [ref=e22]: 0 live
            - paragraph [ref=e29]: Monitor your store's performance and operations.
          - generic [ref=e31]:
            - button "7D" [ref=e32]
            - button "30D" [ref=e33]
            - button "90D" [ref=e34]
            - button "1Y" [ref=e35]
        - generic [ref=e36]: "Read-only metrics: these values are system-derived operational history and cannot be edited or deleted."
        - generic [ref=e37]:
          - generic [ref=e39]:
            - generic [ref=e41]:
              - paragraph [ref=e42]: Today's Revenue
              - generic [ref=e43]: £0.00
            - generic [ref=e48]: 0 orders today
          - generic [ref=e50]:
            - generic [ref=e52]:
              - paragraph [ref=e53]: Total Revenue
              - generic [ref=e54]: £118.99
            - generic [ref=e58]: "-"
          - generic [ref=e60]:
            - generic [ref=e62]:
              - paragraph [ref=e63]: Total Orders
              - generic [ref=e64]: "17"
            - generic [ref=e70]: "-"
          - generic [ref=e72]:
            - generic [ref=e74]:
              - paragraph [ref=e75]: Customers
              - generic [ref=e76]: "11"
            - generic [ref=e83]: "-"
          - generic [ref=e85]:
            - generic [ref=e87]:
              - paragraph [ref=e88]: Avg Order Value
              - generic [ref=e89]: £118.99
            - generic [ref=e95]: "-"
          - generic [ref=e97]:
            - generic [ref=e99]:
              - paragraph [ref=e100]: Low Stock Alerts
              - generic [ref=e101]: "16"
            - generic [ref=e105]: "-"
        - generic [ref=e106]:
          - generic [ref=e107]: Revenue Overview
          - generic [ref=e117]:
            - generic [ref=e118]: Order Status
            - generic [ref=e120]:
              - generic [ref=e121]:
                - generic:
                  - generic: "17"
                  - generic: Orders
              - generic [ref=e125]:
                - generic [ref=e126]:
                  - generic [ref=e127]: awaiting payment
                  - generic [ref=e130]: "15"
                - generic [ref=e131]:
                  - generic [ref=e132]: payment received
                  - generic [ref=e135]: "1"
                - generic [ref=e136]:
                  - generic [ref=e137]: pending
                  - generic [ref=e140]: "1"
        - generic [ref=e141]:
          - generic [ref=e142]:
            - generic [ref=e143]: New Customers
            - img [ref=e149]:
              - generic [ref=e153]:
                - generic [ref=e154]: 23 Aug
                - generic [ref=e156]: 28 Aug
              - generic [ref=e159]:
                - generic [ref=e160]: "0"
                - generic [ref=e162]: "2"
                - generic [ref=e164]: "4"
                - generic [ref=e166]: "6"
                - generic [ref=e168]: "8"
          - generic [ref=e172]:
            - generic [ref=e173]: Revenue by Category
            - img [ref=e179]:
              - generic [ref=e181]:
                - generic [ref=e182]: £0
                - generic [ref=e184]: £30
                - generic [ref=e186]: £60
                - generic [ref=e188]: £90
                - generic [ref=e190]: £120
              - generic [ref=e193]:
                - generic [ref=e194]: HealingPepti…
                - generic [ref=e196]: Accessories
          - generic [ref=e205]:
            - generic [ref=e206]: Top Products
            - generic [ref=e209]:
              - generic [ref=e210]:
                - generic [ref=e211]: "1"
                - generic [ref=e212]:
                  - paragraph [ref=e213]: BPC-157 10mg
                  - paragraph [ref=e214]: 1 units sold
                - generic [ref=e215]: £110.00
              - generic [ref=e216]:
                - generic [ref=e217]: "2"
                - generic [ref=e218]:
                  - paragraph [ref=e219]: Bacteriostatic Water 10ml
                  - paragraph [ref=e220]: 1 units sold
                - generic [ref=e221]: £8.99
    - region "Notifications (F8)":
      - list
  - generic [ref=e222]: Healing Pepti…
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
  39 |   expect(response.ok(), await response.text()).toBeTruthy();
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
> 51 |   expect(declared).toEqual([...STATIC_ADMIN_ROUTES, ...DYNAMIC_ADMIN_ROUTE_PATTERNS].sort());
     |                    ^ Error: expect(received).toEqual(expected) // deep equality
  52 | }
```