import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  STATIC_ADMIN_ROUTES,
  authenticateAdmin,
  expectDeclaredAdminRoutes,
} from "./admin-routes";

async function expectNoHorizontalOverflow(locator: Locator, description: string) {
  const overflowing = await locator.evaluateAll((elements) =>
    elements.flatMap((element, index) => {
      const node = element as HTMLElement;
      return node.scrollWidth > node.clientWidth + 1
        ? [{
            index,
            clientWidth: node.clientWidth,
            scrollWidth: node.scrollWidth,
            element: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}.${[...node.classList].join(".")}`,
            widestChildren: [...node.querySelectorAll<HTMLElement>("*")]
              .filter((child) => child.scrollWidth > node.clientWidth + 1)
              .slice(0, 5)
              .map((child) => ({
                element: `${child.tagName.toLowerCase()}.${[...child.classList].join(".")}`,
                scrollWidth: child.scrollWidth,
              })),
          }]
        : [];
    }),
  );
  expect(overflowing, `${description} must not overflow horizontally`).toEqual([]);
}

async function expectMobileRecordsAreUsable(page: Page, route: string) {
  const tableRecords = page.locator(".admin-page tbody tr:visible");
  const markedRecords = page.locator("[data-admin-mobile-record]:visible");
  const records = tableRecords.or(markedRecords);
  const cells = tableRecords.locator("td:visible:not([colspan])");

  if (await cells.count()) {
    const missingLabels = await cells.evaluateAll((elements) =>
      elements.flatMap((element, index) => {
        const label = element.getAttribute("data-label")?.trim();
        return label ? [] : [{ index, text: element.textContent?.trim().slice(0, 80) }];
      }),
    );
    expect(missingLabels, `${route} mobile table cells must retain meaningful labels`).toEqual([]);
  }

  const interactiveSelector = [
    "button",
    "a[href]",
    "input",
    "select",
    "textarea",
    '[role="button"]',
    '[role="link"]',
    '[role="checkbox"]',
    '[role="switch"]',
  ].join(", ");
  const unnamedActions = await records
    .locator(`:scope:is(${interactiveSelector}):visible, ${interactiveSelector.split(", ").map((selector) => `${selector}:visible`).join(", ")}`)
    .evaluateAll((elements) =>
      elements.flatMap((element, index) => {
        const node = element as HTMLElement;
        const labelledBy = node.getAttribute("aria-labelledby")
          ?.split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent)
          .join(" ");
        const associatedLabel = "labels" in node
          ? [...(node as HTMLInputElement).labels ?? []].map((label) => label.textContent).join(" ")
          : undefined;
        const name = [
          node.getAttribute("aria-label"),
          labelledBy,
          associatedLabel,
          node.getAttribute("title"),
          node.textContent,
          node.getAttribute("placeholder"),
          node.getAttribute("alt"),
        ].find((value) => value?.trim());
        return name ? [] : [{ index, html: node.outerHTML.slice(0, 180) }];
      }),
    );
  expect(unnamedActions, `${route} mobile record actions must have accessible names`).toEqual([]);

  await expectNoHorizontalOverflow(page.locator("html, body, #root, [data-admin-content], .admin-page"), `${route} document`);
  await expectNoHorizontalOverflow(records, `${route} records`);
  await expectNoHorizontalOverflow(markedRecords, `${route} marked mobile records`);
}

async function visitAndCheck(page: Page, route: string) {
  await page.goto(route);
  await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`));
  await expect(page.locator("[data-admin-content]")).toBeVisible();
  await expectMobileRecordsAreUsable(page, route);
}

test.beforeEach(async ({ page }) => {
  await authenticateAdmin(page);
});

test("declared admin routes stay covered by the mobile regression suite", async () => {
  await expectDeclaredAdminRoutes();
});

test("every admin route and available detail route fits the viewport", async ({ page }) => {
  for (const route of STATIC_ADMIN_ROUTES) {
    await visitAndCheck(page, route);
  }

  for (const [listRoute, pattern] of [
    ["/orders", /^\/orders\/[^/]+$/],
    ["/customers", /^\/customers\/[^/]+$/],
  ] as const) {
    await page.goto(listRoute);
    const href = await page.locator(`a[href^="${listRoute}/"]`).first().getAttribute("href").catch(() => null);
    if (href && pattern.test(href)) {
      await visitAndCheck(page, href);
    }
  }
});

test("mobile navigation, specialist tools, alerts, tabs, and dialogs remain usable", async ({ page }) => {
  await page.getByRole("button", { name: "Open admin navigation" }).click();
  const drawer = page.getByRole("dialog", { name: "Admin navigation" });
  await expect(drawer).toBeVisible();
  await expectNoHorizontalOverflow(drawer, "navigation drawer");

  await drawer.getByRole("button", { name: "Specialist tools" }).click();
  await expect(drawer.getByRole("link", { name: "Wholesale" })).toBeVisible();
  await expectNoHorizontalOverflow(drawer.locator("nav"), "Specialist tools navigation");
  await page.keyboard.press("Escape");

  await page.locator("header").getByRole("button").filter({ has: page.locator("svg.lucide-bell") }).click();
  await expect(page.getByText("View all")).toBeVisible();
  await expectNoHorizontalOverflow(page.getByText("View all").locator("xpath=..").locator("xpath=.."), "alerts popover");
  await page.keyboard.press("Escape");

  await page.goto("/affiliates");
  const tabs = page.getByRole("tablist");
  await expect(tabs).toBeVisible();
  await expectNoHorizontalOverflow(tabs, "affiliate tabs");
  await expect(tabs.getByRole("tab")).toHaveCount(5);

  for (const dialogCase of [
    { route: "/products", button: /Add (New )?Product/i },
    { route: "/discounts", button: /Create Discount|Add Discount/i },
  ]) {
    await page.goto(dialogCase.route);
    await page.getByRole("button", { name: dialogCase.button }).first().click();
    const dialog = page.getByRole("dialog").last();
    await expect(dialog).toBeVisible();
    await expectNoHorizontalOverflow(dialog, `${dialogCase.route} dialog`);
    await expect(dialog.getByRole("button", { name: /Cancel|Close/i }).first()).toBeVisible();
    await page.keyboard.press("Escape");
  }
});