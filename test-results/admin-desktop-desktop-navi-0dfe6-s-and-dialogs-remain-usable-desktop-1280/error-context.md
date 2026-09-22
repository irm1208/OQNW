# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-desktop.spec.ts >> desktop navigation, specialist tools, alerts, tabs, and dialogs remain usable
- Location: tests/admin-desktop/admin-desktop.spec.ts:102:5

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('aside').getByRole('button', { name: 'Specialist tools' })

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
                - generic [ref=e106]: 0 live
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
  30  |   await expect(heading, `${route} must retain a visible page heading`).toBeVisible();
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
> 106 |   await specialistTools.click();
      |                         ^ Error: locator.click: Test timeout of 180000ms exceeded.
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
  131 |   }
  132 | });
```