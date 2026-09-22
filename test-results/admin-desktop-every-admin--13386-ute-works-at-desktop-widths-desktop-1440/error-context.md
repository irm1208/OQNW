# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-desktop.spec.ts >> every admin route and available detail route works at desktop widths
- Location: tests/admin-desktop/admin-desktop.spec.ts:85:5

# Error details

```
Error: /customer-segments/:id must retain a visible page heading

expect(locator).toBeVisible() failed

Locator: locator('[data-admin-content]').getByRole('heading').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - /customer-segments/:id must retain a visible page heading with timeout 10000ms
  - waiting for locator('[data-admin-content]').getByRole('heading').first()

```

```yaml
- complementary:
  - img "OmniQure"
  - text: OmniQure Admin
  - navigation:
    - link "Dashboard":
      - /url: /dashboard
    - button "Orders"
    - button "Products & Inventory"
    - button "Customers" [expanded]
    - link "Customers":
      - /url: /customers
    - link "Segments":
      - /url: /customer-segments
    - link "Loyalty":
      - /url: /loyalty
    - link "Credits":
      - /url: /credits
    - link "Referrals":
      - /url: /referrals
    - link "Affiliates":
      - /url: /affiliates
    - link "Fulfilment":
      - /url: /fulfillment
    - button "Returns"
    - button "Marketing"
    - link "Reports":
      - /url: /reports
    - button "Risk & Security"
    - button "Settings"
  - button "Logout"
- main:
  - button "Search orders, customers, products... ⌘ K"
  - button "Notifications": "17"
  - button "Log out"
  - paragraph: Invalid segment ID
  - button "Back to Segments"
- region "Notifications (F8)":
  - list
```

# Test source

```ts
  1   | import { expect, test, type Page } from "@playwright/test";
  2   | import {
  3   |   STATIC_ADMIN_ROUTES,
  4   |   authenticateAdmin,
  5   |   expectDeclaredAdminRoutes,
  6   | } from "../admin-mobile/admin-routes";
  7   | 
  8   | async function expectNoDocumentHorizontalOverflow(page: Page, route: string) {
  9   |   const dimensions = await page.evaluate(() => ({
  10  |     body: { clientWidth: document.body.clientWidth, scrollWidth: document.body.scrollWidth },
  11  |     documentElement: {
  12  |       clientWidth: document.documentElement.clientWidth,
  13  |       scrollWidth: document.documentElement.scrollWidth,
  14  |     },
  15  |   }));
  16  |   expect(dimensions, `${route} must not cause document-level horizontal overflow`).toEqual({
  17  |     body: { clientWidth: dimensions.body.clientWidth, scrollWidth: dimensions.body.clientWidth },
  18  |     documentElement: {
  19  |       clientWidth: dimensions.documentElement.clientWidth,
  20  |       scrollWidth: dimensions.documentElement.clientWidth,
  21  |     },
  22  |   });
  23  | }
  24  | 
  25  | async function expectVisiblePageHeadingAndContent(page: Page, route: string) {
  26  |   const content = page.locator("[data-admin-content]");
  27  |   await expect(content, `${route} primary admin content must be visible`).toBeVisible();
  28  | 
  29  |   const heading = content.getByRole("heading").first();
> 30  |   await expect(heading, `${route} must retain a visible page heading`).toBeVisible();
      |                                                                        ^ Error: /customer-segments/:id must retain a visible page heading
  31  |   const box = await heading.boundingBox();
  32  |   expect(box, `${route} heading must have a layout box`).not.toBeNull();
  33  |   expect(
  34  |     box!.x + box!.width,
  35  |     `${route} heading must remain within the desktop viewport`,
  36  |   ).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  37  | }
  38  | 
  39  | async function expectRecordActionsAreNamed(page: Page, route: string) {
  40  |   const records = page.locator(".admin-page tbody tr:visible");
  41  |   if (!(await records.count())) return;
  42  | 
  43  |   const unnamed = await records
  44  |     .locator("button:visible, a[href]:visible, input:visible, select:visible, textarea:visible")
  45  |     .evaluateAll((elements) =>
  46  |       elements.flatMap((element, index) => {
  47  |         const node = element as HTMLInputElement;
  48  |         const labelledBy = node.getAttribute("aria-labelledby")
  49  |           ?.split(/\s+/)
  50  |           .map((id) => document.getElementById(id)?.textContent)
  51  |           .join(" ");
  52  |         const labels = [...(node.labels ?? [])].map((label) => label.textContent).join(" ");
  53  |         const name = [
  54  |           node.getAttribute("aria-label"),
  55  |           labelledBy,
  56  |           labels,
  57  |           node.getAttribute("title"),
  58  |           node.getAttribute("alt"),
  59  |           node.textContent,
  60  |           node.value,
  61  |           node.getAttribute("placeholder"),
  62  |         ].find((value) => value?.trim());
  63  |         return name ? [] : [{ index, html: node.outerHTML.slice(0, 180) }];
  64  |       }),
  65  |     );
  66  |   expect(unnamed, `${route} record actions must retain accessible names`).toEqual([]);
  67  | }
  68  | 
  69  | async function visitAndCheck(page: Page, route: string) {
  70  |   await page.goto(route);
  71  |   await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`));
  72  |   await expectVisiblePageHeadingAndContent(page, route);
  73  |   await expectNoDocumentHorizontalOverflow(page, route);
  74  |   await expectRecordActionsAreNamed(page, route);
  75  | }
  76  | 
  77  | test.beforeEach(async ({ page }) => {
  78  |   await authenticateAdmin(page);
  79  | });
  80  | 
  81  | test("declared admin routes stay covered by the desktop regression suite", async () => {
  82  |   await expectDeclaredAdminRoutes();
  83  | });
  84  | 
  85  | test("every admin route and available detail route works at desktop widths", async ({ page }) => {
  86  |   for (const route of STATIC_ADMIN_ROUTES) {
  87  |     await visitAndCheck(page, route);
  88  |   }
  89  | 
  90  |   for (const [listRoute, pattern] of [
  91  |     ["/orders", /^\/orders\/[^/]+$/],
  92  |     ["/customers", /^\/customers\/[^/]+$/],
  93  |   ] as const) {
  94  |     await page.goto(listRoute);
  95  |     const href = await page.locator(`a[href^="${listRoute}/"]`).first().getAttribute("href").catch(() => null);
  96  |     if (href && pattern.test(href)) {
  97  |       await visitAndCheck(page, href);
  98  |     }
  99  |   }
  100 | });
  101 | 
  102 | test("desktop navigation, specialist tools, alerts, tabs, and dialogs remain usable", async ({ page }) => {
  103 |   const sidebar = page.locator("aside");
  104 |   await expect(sidebar).toBeVisible();
  105 |   const specialistTools = sidebar.getByRole("button", { name: "Specialist tools" });
  106 |   await specialistTools.click();
  107 |   await expect(specialistTools).toHaveAttribute("aria-expanded", "true");
  108 |   await expect(sidebar.getByRole("link", { name: "Wholesale" })).toBeVisible();
  109 | 
  110 |   await sidebar.getByRole("button", { name: "Notifications" }).click();
  111 |   await expect(page.getByText("View all")).toBeVisible();
  112 |   await page.keyboard.press("Escape");
  113 | 
  114 |   await page.goto("/affiliates");
  115 |   const tabs = page.getByRole("tablist");
  116 |   await expect(tabs).toBeVisible();
  117 |   const tiers = tabs.getByRole("tab", { name: "Tiers" });
  118 |   await tiers.click();
  119 |   await expect(tiers).toHaveAttribute("aria-selected", "true");
  120 | 
  121 |   for (const dialogCase of [
  122 |     { route: "/products", button: /Add (New )?Product/i },
  123 |     { route: "/discounts", button: /Create Discount|Add Discount/i },
  124 |   ]) {
  125 |     await page.goto(dialogCase.route);
  126 |     await page.getByRole("button", { name: dialogCase.button }).first().click();
  127 |     const dialog = page.getByRole("dialog").last();
  128 |     await expect(dialog).toBeVisible();
  129 |     await expect(dialog.getByRole("button", { name: /Cancel|Close/i }).first()).toBeVisible();
  130 |     await page.keyboard.press("Escape");
```