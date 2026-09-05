import { defineConfig } from "@playwright/test";
import { adminWebServer } from "./playwright.shared";

export default defineConfig({
  testDir: ".",
  testMatch: "admin-mobile.spec.ts",
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
  projects: [320, 375, 390].map((width) => ({
    name: `mobile-${width}`,
    use: {
      viewport: { width, height: 844 },
    },
  })),
  webServer: adminWebServer,
});