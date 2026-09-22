# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-mobile.spec.ts >> every admin route and available detail route fits the viewport
- Location: tests/admin-mobile/admin-mobile.spec.ts:105:5

# Error details

```
Error: /stock-alerts document must not overflow horizontally

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 30

- Array []
+ Array [
+   Object {
+     "clientWidth": 358,
+     "element": "div.admin-page.mx-auto.w-full.max-w-[1440px]",
+     "index": 4,
+     "scrollWidth": 372,
+     "widestChildren": Array [
+       Object {
+         "element": "div.admin-page.space-y-6",
+         "scrollWidth": 372,
+       },
+       Object {
+         "element": "div.rounded-xl.border.border-red-200.bg-red-50.p-4",
+         "scrollWidth": 371,
+       },
+     ],
+   },
+   Object {
+     "clientWidth": 358,
+     "element": "div.admin-page.space-y-6",
+     "index": 5,
+     "scrollWidth": 372,
+     "widestChildren": Array [
+       Object {
+         "element": "div.rounded-xl.border.border-red-200.bg-red-50.p-4",
+         "scrollWidth": 371,
+       },
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=f19e2]:
  - main [ref=f19e4]:
    - generic [ref=f19e5]:
      - generic [ref=f19e6]:
        - button "Open admin navigation" [ref=f19e7]
        - img "OmniQure Admin" [ref=f19e8]
      - generic [ref=f19e9]:
        - button "Search" [ref=f19e11]
        - button "Notifications" [ref=f19e13]:
          - generic [ref=f19e14]: "17"
    - generic [ref=f19e17]:
      - generic [ref=f19e18]:
        - heading "Back-in-Stock Alerts" [level=1] [ref=f19e19]
        - paragraph [ref=f19e20]: Customers waiting to be notified when out-of-stock products return.
      - generic [ref=f19e21]:
        - generic [ref=f19e22]: Needs attention
        - generic [ref=f19e28]:
          - button "New · Tirzepatide 10mg — 10 units remaining" [ref=f19e29] [cursor=pointer]
          - button "New · TB-500 5mg — 10 units remaining" [ref=f19e30] [cursor=pointer]
          - button "New · SS-31 10mg — 10 units remaining" [ref=f19e31] [cursor=pointer]
          - button "New · Semax + Selank Blend 20mg — 1 unit remaining" [ref=f19e32] [cursor=pointer]
          - button "New · Retatrutide 60mg — 5 units remaining" [ref=f19e33] [cursor=pointer]
          - button "New · Retatrutide 50mg — 10 units remaining" [ref=f19e34] [cursor=pointer]
          - button "New · Retatrutide 20mg — 5 units remaining" [ref=f19e35] [cursor=pointer]
          - button "New · N-Acetyl Semax Amidate 10mg — 9 units remaining" [ref=f19e36] [cursor=pointer]
          - button "New · N-Acetyl Selank Amidate 10mg — 9 units remaining" [ref=f19e37] [cursor=pointer]
          - button "New · Melanotan 2 10mg — 10 units remaining" [ref=f19e38] [cursor=pointer]
          - button "New · LL-37 5mg — 7 units remaining" [ref=f19e39] [cursor=pointer]
          - button "New · Kisspeptin-10 5mg — 10 units remaining" [ref=f19e40] [cursor=pointer]
          - button "New · GHK-Cu 50mg — 7 units remaining" [ref=f19e41] [cursor=pointer]
          - button "New · Epithalon 10mg — 5 units remaining" [ref=f19e42] [cursor=pointer]
          - button "New · DSIP 10mg — 7 units remaining" [ref=f19e43] [cursor=pointer]
          - button "New · BPC-157 + TB-500 Blend 20mg — 4 units remaining" [ref=f19e44] [cursor=pointer]
      - generic [ref=f19e45]:
        - generic [ref=f19e53]:
          - paragraph [ref=f19e54]: "0"
          - paragraph [ref=f19e55]: Pending Notifications
        - generic [ref=f19e62]:
          - paragraph [ref=f19e63]: "0"
          - paragraph [ref=f19e64]: Products with Waitlists
        - generic [ref=f19e70]:
          - paragraph [ref=f19e71]: "0"
          - paragraph [ref=f19e72]: Already Notified
      - generic [ref=f19e73]:
        - paragraph [ref=f19e77]: No stock alert requests yet
        - paragraph [ref=f19e78]: When customers sign up for back-in-stock notifications on product pages, they will appear here.
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
  1   | import { expect, test, type Locator, type Page } from "@playwright/test";
  2   | import {
  3   |   STATIC_ADMIN_ROUTES,
  4   |   authenticateAdmin,
  5   |   expectDeclaredAdminRoutes,
  6   | } from "./admin-routes";
  7   | 
  8   | async function expectNoHorizontalOverflow(locator: Locator, description: string) {
  9   |   const overflowing = await locator.evaluateAll((elements) =>
  10  |     elements.flatMap((element, index) => {
  11  |       const node = element as HTMLElement;
  12  |       return node.scrollWidth > node.clientWidth + 1
  13  |         ? [{
  14  |             index,
  15  |             clientWidth: node.clientWidth,
  16  |             scrollWidth: node.scrollWidth,
  17  |             element: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}.${[...node.classList].join(".")}`,
  18  |             widestChildren: [...node.querySelectorAll<HTMLElement>("*")]
  19  |               .filter((child) => child.scrollWidth > node.clientWidth + 1)
  20  |               .slice(0, 5)
  21  |               .map((child) => ({
  22  |                 element: `${child.tagName.toLowerCase()}.${[...child.classList].join(".")}`,
  23  |                 scrollWidth: child.scrollWidth,
  24  |               })),
  25  |           }]
  26  |         : [];
  27  |     }),
  28  |   );
> 29  |   expect(overflowing, `${description} must not overflow horizontally`).toEqual([]);
      |                                                                        ^ Error: /stock-alerts document must not overflow horizontally
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
  128 |   await drawer.getByRole("button", { name: "Specialist tools" }).click();
  129 |   await expect(drawer.getByRole("link", { name: "Wholesale" })).toBeVisible();
```