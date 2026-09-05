import { expect, test } from "@playwright/test";

const ADMIN_BASE = "/imtheonlyadmin";

test("published admin keeps mounted mobile routing, assets, table, and dialog working", async ({
  page,
}) => {
  const failedAssets: string[] = [];
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (
      url.origin === "http://127.0.0.1:5003" &&
      url.pathname.startsWith(`${ADMIN_BASE}/`) &&
      /\.(?:css|js|ico|png|svg)(?:\?|$)/.test(url.pathname + url.search) &&
      response.status() >= 400
    ) {
      failedAssets.push(`${response.status()} ${url.pathname}`);
    }
  });

  await page.goto(`${ADMIN_BASE}/products`);
  await expect(page).toHaveURL(`${ADMIN_BASE}/login`);
  await expect(page.getByText("OmniQure Ops")).toBeVisible();

  const loginResponse = await page.request.post(
    "/api/admin/auth/development-login",
  );
  expect(loginResponse.ok(), await loginResponse.text()).toBeTruthy();

  await page.goto(`${ADMIN_BASE}/products`);
  await expect(page).toHaveURL(`${ADMIN_BASE}/products`);
  await expect(page.locator("[data-admin-content]")).toBeVisible();
  await expect(page.locator(".admin-page table")).toBeVisible();

  await page.getByRole("button", { name: "Open admin navigation" }).click();
  const navigation = page.getByRole("dialog", { name: "Admin navigation" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
    "href",
    `${ADMIN_BASE}/dashboard`,
  );
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Add Product" }).click();
  const productDialog = page.getByRole("dialog").last();
  await expect(productDialog).toBeVisible();
  await expect(
    productDialog.getByRole("button", { name: /Cancel|Close/i }).first(),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(productDialog).toBeHidden();

  expect(failedAssets).toEqual([]);
});