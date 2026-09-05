import { defineConfig } from "@playwright/test";
import { adminWebServer } from "../admin-mobile/playwright.shared";

export default defineConfig({
  testDir: ".",
  testMatch: "admin-desktop.spec.ts",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  timeout: 180_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: "http://127.0.0.1:5002",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [1280, 1440].map((width) => ({
    name: `desktop-${width}`,
    use: {
      viewport: { width, height: 900 },
    },
  })),
  webServer: adminWebServer,
});