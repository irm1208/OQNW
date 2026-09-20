# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-desktop.spec.ts >> declared admin routes stay covered by the desktop regression suite
- Location: tests/admin-desktop/admin-desktop.spec.ts:81:5

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
    - generic [ref=e3]:
      - complementary [ref=e4]:
        - generic [ref=e6]:
          - img "OmniQure" [ref=e7]
          - generic [ref=e8]: OmniQure Admin
        - navigation [ref=e9]:
          - generic [ref=e10]:
            - link "Dashboard" [ref=e11] [cursor=pointer]:
              - /url: /dashboard
            - button "Orders" [ref=e19]
            - button "Products & Inventory" [ref=e28]
            - button "Customers" [ref=e37]
            - link "Fulfilment" [ref=e46] [cursor=pointer]:
              - /url: /fulfillment
            - button "Returns" [ref=e52]
            - button "Marketing" [ref=e60]
            - link "Reports" [ref=e68] [cursor=pointer]:
              - /url: /reports
            - button "Risk & Security" [ref=e73]
            - button "Settings" [ref=e80]
        - button "Logout" [ref=e88]
      - main [ref=e89]:
        - generic [ref=e90]:
          - button "Search orders, customers, products... ⌘ K" [ref=e92]:
            - generic [ref=e93]: Search orders, customers, products...
            - generic:
              - generic: ⌘
              - text: K
          - generic [ref=e94]:
            - button "Notifications" [ref=e96]:
              - generic [ref=e97]: "17"
            - button "Log out" [ref=e98]
        - generic [ref=e101]:
          - generic [ref=e102]:
            - generic [ref=e103]:
              - generic [ref=e104]:
                - heading "Overview" [level=2] [ref=e105]
                - generic [ref=e106]: 1 live
              - paragraph [ref=e113]: Monitor your store's performance and operations.
            - generic [ref=e115]:
              - button "7D" [ref=e116]
              - button "30D" [ref=e117]
              - button "90D" [ref=e118]
              - button "1Y" [ref=e119]
          - generic [ref=e120]: "Read-only metrics: these values are system-derived operational history and cannot be edited or deleted."
          - generic [ref=e121]:
            - generic [ref=e123]:
              - generic [ref=e125]:
                - paragraph [ref=e126]: Today's Revenue
                - generic [ref=e127]: £0.00
              - generic [ref=e132]: 0 orders today
            - generic [ref=e134]:
              - generic [ref=e136]:
                - paragraph [ref=e137]: Total Revenue
                - generic [ref=e138]: £118.99
              - generic [ref=e142]: "-"
            - generic [ref=e144]:
              - generic [ref=e146]:
                - paragraph [ref=e147]: Total Orders
                - generic [ref=e148]: "17"
              - generic [ref=e154]: "-"
            - generic [ref=e156]:
              - generic [ref=e158]:
                - paragraph [ref=e159]: Customers
                - generic [ref=e160]: "11"
              - generic [ref=e167]: "-"
            - generic [ref=e169]:
              - generic [ref=e171]:
                - paragraph [ref=e172]: Avg Order Value
                - generic [ref=e173]: £118.99
              - generic [ref=e179]: "-"
            - generic [ref=e181]:
              - generic [ref=e183]:
                - paragraph [ref=e184]: Low Stock Alerts
                - generic [ref=e185]: "16"
              - generic [ref=e189]: "-"
          - generic [ref=e190]:
            - generic [ref=e191]: Revenue Overview
            - generic [ref=e201]:
              - generic [ref=e202]: Order Status
              - generic [ref=e204]:
                - generic [ref=e205]:
                  - generic:
                    - generic: "17"
                    - generic: Orders
                - generic [ref=e217]:
                  - generic [ref=e218]:
                    - generic [ref=e219]: awaiting payment
                    - generic [ref=e222]: "15"
                  - generic [ref=e223]:
                    - generic [ref=e224]: payment received
                    - generic [ref=e227]: "1"
                  - generic [ref=e228]:
                    - generic [ref=e229]: pending
                    - generic [ref=e232]: "1"
          - generic [ref=e233]:
            - generic [ref=e234]:
              - generic [ref=e235]: New Customers
              - img [ref=e241]:
                - generic [ref=e245]:
                  - generic [ref=e246]: 23 Aug
                  - generic [ref=e248]: 28 Aug
                - generic [ref=e251]:
                  - generic [ref=e252]: "0"
                  - generic [ref=e254]: "2"
                  - generic [ref=e256]: "4"
                  - generic [ref=e258]: "6"
                  - generic [ref=e260]: "8"
            - generic [ref=e264]:
              - generic [ref=e265]: Revenue by Category
              - img [ref=e271]:
                - generic [ref=e273]:
                  - generic [ref=e274]: £0
                  - generic [ref=e276]: £30
                  - generic [ref=e278]: £60
                  - generic [ref=e280]: £90
                  - generic [ref=e282]: £120
                - generic [ref=e285]:
                  - generic [ref=e286]: HealingPepti…
                  - generic [ref=e288]: Accessories
            - generic [ref=e297]:
              - generic [ref=e298]: Top Products
              - generic [ref=e301]:
                - generic [ref=e302]:
                  - generic [ref=e303]: "1"
                  - generic [ref=e304]:
                    - paragraph [ref=e305]: BPC-157 10mg
                    - paragraph [ref=e306]: 1 units sold
                  - generic [ref=e307]: £110.00
                - generic [ref=e308]:
                  - generic [ref=e309]: "2"
                  - generic [ref=e310]:
                    - paragraph [ref=e311]: Bacteriostatic Water 10ml
                    - paragraph [ref=e312]: 1 units sold
                  - generic [ref=e313]: £8.99
    - region "Notifications (F8)":
      - list
  - generic [ref=e314]: Healing Pepti…
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