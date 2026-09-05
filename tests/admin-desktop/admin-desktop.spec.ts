import { expect, test, type Page } from "@playwright/test";
import {
  STATIC_ADMIN_ROUTES,
  authenticateAdmin,
  expectDeclaredAdminRoutes,
} from "../admin-mobile/admin-routes";

async function expectNoDocumentHorizontalOverflow(page: Page, route: string) {
  const dimensions = await page.evaluate(() => ({
    body: { clientWidth: document.body.clientWidth, scrollWidth: document.body.scrollWidth },
    documentElement: {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    },
  }));
  expect(dimensions, `${route} must not cause document-level horizontal overflow`).toEqual({
    body: { clientWidth: dimensions.body.clientWidth, scrollWidth: dimensions.body.clientWidth },
    documentElement: {
      clientWidth: dimensions.documentElement.clientWidth,
      scrollWidth: dimensions.documentElement.clientWidth,
    },
  });
}

async function expectVisiblePageHeadingAndContent(page: Page, route: string) {
  const content = page.locator("[data-admin-content]");
  await expect(content, `${route} primary admin content must be visible`).toBeVisible();

  const heading = content.getByRole("heading").first();
  await expect(heading, `${route} must retain a visible page heading`).toBeVisible();
  const box = await heading.boundingBox();
  expect(box, `${route} heading must have a layout box`).not.toBeNull();
  expect(
    box!.x + box!.width,
    `${route} heading must remain within the desktop viewport`,
  ).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
}

async function expectRecordActionsAreNamed(page: Page, route: string) {
  const records = page.locator(".admin-page tbody tr:visible");
  if (!(await records.count())) return;

  const unnamed = await records
    .locator("button:visible, a[href]:visible, input:visible, select:visible, textarea:visible")
    .evaluateAll((elements) =>
      elements.flatMap((element, index) => {
        const node = element as HTMLInputElement;
        const labelledBy = node.getAttribute("aria-labelledby")
          ?.split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent)
          .join(" ");
        const labels = [...(node.labels ?? [])].map((label) => label.textContent).join(" ");
        const name = [
          node.getAttribute("aria-label"),
          labelledBy,
          labels,
          node.getAttribute("title"),
          node.getAttribute("alt"),
          node.textContent,
          node.value,
          node.getAttribute("placeholder"),
        ].find((value) => value?.trim());
        return name ? [] : [{ index, html: node.outerHTML.slice(0, 180) }];
      }),
    );
  expect(unnamed, `${route} record actions must retain accessible names`).toEqual([]);
}

async function visitAndCheck(page: Page, route: string) {
  await page.goto(route);
  await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`));
  await expectVisiblePageHeadingAndContent(page, route);
  await expectNoDocumentHorizontalOverflow(page, route);
  await expectRecordActionsAreNamed(page, route);
}

test.beforeEach(async ({ page }) => {
  await authenticateAdmin(page);
});

test("declared admin routes stay covered by the desktop regression suite", async () => {
  await expectDeclaredAdminRoutes();
});

test("every admin route and available detail route works at desktop widths", async ({ page }) => {
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

test("desktop navigation, specialist tools, alerts, tabs, and dialogs remain usable", async ({ page }) => {
  const sidebar = page.locator("aside");
  await expect(sidebar).toBeVisible();
  const specialistTools = sidebar.getByRole("button", { name: "Specialist tools" });
  await specialistTools.click();
  await expect(specialistTools).toHaveAttribute("aria-expanded", "true");
  await expect(sidebar.getByRole("link", { name: "Wholesale" })).toBeVisible();

  await sidebar.getByRole("button", { name: "Notifications" }).click();
  await expect(page.getByText("View all")).toBeVisible();
  await page.keyboard.press("Escape");

  await page.goto("/affiliates");
  const tabs = page.getByRole("tablist");
  await expect(tabs).toBeVisible();
  const tiers = tabs.getByRole("tab", { name: "Tiers" });
  await tiers.click();
  await expect(tiers).toHaveAttribute("aria-selected", "true");

  for (const dialogCase of [
    { route: "/products", button: /Add (New )?Product/i },
    { route: "/discounts", button: /Create Discount|Add Discount/i },
  ]) {
    await page.goto(dialogCase.route);
    await page.getByRole("button", { name: dialogCase.button }).first().click();
    const dialog = page.getByRole("dialog").last();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: /Cancel|Close/i }).first()).toBeVisible();
    await page.keyboard.press("Escape");
  }
});