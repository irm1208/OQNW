# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-mobile.spec.ts >> mobile navigation, specialist tools, alerts, tabs, and dialogs remain usable
- Location: tests/admin-mobile/admin-mobile.spec.ts:122:5

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for getByRole('dialog', { name: 'Admin navigation' }).getByRole('button', { name: 'Specialist tools' })

```

# Page snapshot

```yaml
- generic:
  - generic:
    - generic:
      - main:
        - generic:
          - generic:
            - button
          - generic:
            - generic:
              - button
            - generic:
              - button:
                - generic: "17"
        - generic:
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - heading [level=2]: Overview
                    - generic: 0 live
                  - paragraph: Monitor your store's performance and operations.
                - generic:
                  - generic:
                    - button: 7D
                    - button: 30D
                    - button: 90D
                    - button: 1Y
              - generic: "Read-only metrics: these values are system-derived operational history and cannot be edited or deleted."
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Today's Revenue
                        - generic: £0.00
                    - generic: 0 orders today
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Total Revenue
                        - generic: £118.99
                    - generic: "-"
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Total Orders
                        - generic: "17"
                    - generic: "-"
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Customers
                        - generic: "11"
                    - generic: "-"
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Avg Order Value
                        - generic: £118.99
                    - generic: "-"
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Low Stock Alerts
                        - generic: "16"
                    - generic: "-"
              - generic:
                - generic: Revenue Overview
                - generic:
                  - generic: Order Status
                  - generic:
                    - generic:
                      - generic:
                        - generic: "17"
                        - generic: Orders
                    - generic:
                      - generic:
                        - generic: awaiting payment
                        - generic: "15"
                      - generic:
                        - generic: payment received
                        - generic: "1"
                      - generic:
                        - generic: pending
                        - generic: "1"
              - generic:
                - generic:
                  - generic: New Customers
                  - generic:
                    - generic:
                      - generic:
                        - generic:
                          - img:
                            - generic:
                              - generic:
                                - generic: 23 Aug
                                - generic: 28 Aug
                            - generic:
                              - generic:
                                - generic: "0"
                                - generic: "2"
                                - generic: "4"
                                - generic: "6"
                                - generic: "8"
                - generic:
                  - generic: Revenue by Category
                  - generic:
                    - generic:
                      - generic:
                        - generic:
                          - img:
                            - generic:
                              - generic:
                                - generic: £0
                                - generic: £30
                                - generic: £60
                                - generic: £90
                                - generic: £120
                            - generic:
                              - generic:
                                - generic: HealingPepti…
                                - generic: Accessories
                - generic:
                  - generic: Top Products
                  - generic:
                    - generic:
                      - generic:
                        - generic: "1"
                        - generic:
                          - paragraph: BPC-157 10mg
                          - paragraph: 1 units sold
                        - generic: £110.00
                      - generic:
                        - generic: "2"
                        - generic:
                          - paragraph: Bacteriostatic Water 10ml
                          - paragraph: 1 units sold
                        - generic: £8.99
    - list
  - generic: Healing Pepti…
  - dialog [ref=e2]:
    - button "Close" [active] [ref=e3]
    - generic [ref=e8]:
      - heading "Admin navigation" [level=2] [ref=e9]
      - paragraph [ref=e10]: Navigate to an admin section.
    - generic [ref=e11]:
      - img "OmniQure Admin" [ref=e13]
      - navigation [ref=e14]:
        - generic [ref=e15]:
          - link "Dashboard" [ref=e16] [cursor=pointer]:
            - /url: /dashboard
          - button "Orders" [ref=e24]
          - button "Products & Inventory" [ref=e33]
          - button "Customers" [ref=e42]
          - link "Fulfilment" [ref=e51] [cursor=pointer]:
            - /url: /fulfillment
          - button "Returns" [ref=e57]
          - button "Marketing" [ref=e65]
          - link "Reports" [ref=e73] [cursor=pointer]:
            - /url: /reports
          - button "Risk & Security" [ref=e78]
          - button "Settings" [ref=e85]
      - button "Logout" [ref=e93]
```

# Test source

```ts
  28  |   );
  29  |   expect(overflowing, `${description} must not overflow horizontally`).toEqual([]);
  30  | }
  31  | 
  32  | async function expectMobileRecordsAreUsable(page: Page, route: string) {
  33  |   const tableRecords = page.locator(".admin-page tbody tr:visible");
  34  |   const markedRecords = page.locator("[data-admin-mobile-record]:visible");
  35  |   const records = tableRecords.or(markedRecords);
  36  |   const cells = tableRecords.locator("td:visible:not([colspan])");
  37  | 
  38  |   if (await cells.count()) {
  39  |     const missingLabels = await cells.evaluateAll((elements) =>
  40  |       elements.flatMap((element, index) => {
  41  |         const label = element.getAttribute("data-label")?.trim();
  42  |         return label ? [] : [{ index, text: element.textContent?.trim().slice(0, 80) }];
  43  |       }),
  44  |     );
  45  |     expect(missingLabels, `${route} mobile table cells must retain meaningful labels`).toEqual([]);
  46  |   }
  47  | 
  48  |   const interactiveSelector = [
  49  |     "button",
  50  |     "a[href]",
  51  |     "input",
  52  |     "select",
  53  |     "textarea",
  54  |     '[role="button"]',
  55  |     '[role="link"]',
  56  |     '[role="checkbox"]',
  57  |     '[role="switch"]',
  58  |   ].join(", ");
  59  |   const unnamedActions = await records
  60  |     .locator(`:scope:is(${interactiveSelector}):visible, ${interactiveSelector.split(", ").map((selector) => `${selector}:visible`).join(", ")}`)
  61  |     .evaluateAll((elements) =>
  62  |       elements.flatMap((element, index) => {
  63  |         const node = element as HTMLElement;
  64  |         const labelledBy = node.getAttribute("aria-labelledby")
  65  |           ?.split(/\s+/)
  66  |           .map((id) => document.getElementById(id)?.textContent)
  67  |           .join(" ");
  68  |         const associatedLabel = "labels" in node
  69  |           ? [...(node as HTMLInputElement).labels ?? []].map((label) => label.textContent).join(" ")
  70  |           : undefined;
  71  |         const name = [
  72  |           node.getAttribute("aria-label"),
  73  |           labelledBy,
  74  |           associatedLabel,
  75  |           node.getAttribute("title"),
  76  |           node.textContent,
  77  |           node.getAttribute("placeholder"),
  78  |           node.getAttribute("alt"),
  79  |         ].find((value) => value?.trim());
  80  |         return name ? [] : [{ index, html: node.outerHTML.slice(0, 180) }];
  81  |       }),
  82  |     );
  83  |   expect(unnamedActions, `${route} mobile record actions must have accessible names`).toEqual([]);
  84  | 
  85  |   await expectNoHorizontalOverflow(page.locator("html, body, #root, [data-admin-content], .admin-page"), `${route} document`);
  86  |   await expectNoHorizontalOverflow(records, `${route} records`);
  87  |   await expectNoHorizontalOverflow(markedRecords, `${route} marked mobile records`);
  88  | }
  89  | 
  90  | async function visitAndCheck(page: Page, route: string) {
  91  |   await page.goto(route);
  92  |   await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`));
  93  |   await expect(page.locator("[data-admin-content]")).toBeVisible();
  94  |   await expectMobileRecordsAreUsable(page, route);
  95  | }
  96  | 
  97  | test.beforeEach(async ({ page }) => {
  98  |   await authenticateAdmin(page);
  99  | });
  100 | 
  101 | test("declared admin routes stay covered by the mobile regression suite", async () => {
  102 |   await expectDeclaredAdminRoutes();
  103 | });
  104 | 
  105 | test("every admin route and available detail route fits the viewport", async ({ page }) => {
  106 |   for (const route of STATIC_ADMIN_ROUTES) {
  107 |     await visitAndCheck(page, route);
  108 |   }
  109 | 
  110 |   for (const [listRoute, pattern] of [
  111 |     ["/orders", /^\/orders\/[^/]+$/],
  112 |     ["/customers", /^\/customers\/[^/]+$/],
  113 |   ] as const) {
  114 |     await page.goto(listRoute);
  115 |     const href = await page.locator(`a[href^="${listRoute}/"]`).first().getAttribute("href").catch(() => null);
  116 |     if (href && pattern.test(href)) {
  117 |       await visitAndCheck(page, href);
  118 |     }
  119 |   }
  120 | });
  121 | 
  122 | test("mobile navigation, specialist tools, alerts, tabs, and dialogs remain usable", async ({ page }) => {
  123 |   await page.getByRole("button", { name: "Open admin navigation" }).click();
  124 |   const drawer = page.getByRole("dialog", { name: "Admin navigation" });
  125 |   await expect(drawer).toBeVisible();
  126 |   await expectNoHorizontalOverflow(drawer, "navigation drawer");
  127 | 
> 128 |   await drawer.getByRole("button", { name: "Specialist tools" }).click();
      |                                                                  ^ Error: locator.click: Test timeout of 180000ms exceeded.
  129 |   await expect(drawer.getByRole("link", { name: "Wholesale" })).toBeVisible();
  130 |   await expectNoHorizontalOverflow(drawer.locator("nav"), "Specialist tools navigation");
  131 |   await page.keyboard.press("Escape");
  132 | 
  133 |   await page.locator("header").getByRole("button").filter({ has: page.locator("svg.lucide-bell") }).click();
  134 |   await expect(page.getByText("View all")).toBeVisible();
  135 |   await expectNoHorizontalOverflow(page.getByText("View all").locator("xpath=..").locator("xpath=.."), "alerts popover");
  136 |   await page.keyboard.press("Escape");
  137 | 
  138 |   await page.goto("/affiliates");
  139 |   const tabs = page.getByRole("tablist");
  140 |   await expect(tabs).toBeVisible();
  141 |   await expectNoHorizontalOverflow(tabs, "affiliate tabs");
  142 |   await expect(tabs.getByRole("tab")).toHaveCount(5);
  143 | 
  144 |   for (const dialogCase of [
  145 |     { route: "/products", button: /Add (New )?Product/i },
  146 |     { route: "/discounts", button: /Create Discount|Add Discount/i },
  147 |   ]) {
  148 |     await page.goto(dialogCase.route);
  149 |     await page.getByRole("button", { name: dialogCase.button }).first().click();
  150 |     const dialog = page.getByRole("dialog").last();
  151 |     await expect(dialog).toBeVisible();
  152 |     await expectNoHorizontalOverflow(dialog, `${dialogCase.route} dialog`);
  153 |     await expect(dialog.getByRole("button", { name: /Cancel|Close/i }).first()).toBeVisible();
  154 |     await page.keyboard.press("Escape");
  155 |   }
  156 | });
```