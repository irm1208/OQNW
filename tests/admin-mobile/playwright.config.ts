import { defineConfig } from "@playwright/test";
import {
  adminWebServer,
  publishedAdminWebServer,
} from "./playwright.shared";

export default defineConfig({
  testDir: ".",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  timeout: 180_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.ADMIN_MOBILE_PUBLISHED === "1"
      ? "http://127.0.0.1:5004"
      : "http://127.0.0.1:5002",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    ...[320, 375, 390].map((width) => ({
      name: `mobile-${width}`,
      testMatch: "admin-mobile.spec.ts",
      use: {
        viewport: { width, height: 844 },
      },
    })),
    {
      name: "published-mobile-320",
      testMatch: "admin-mobile-published.spec.ts",
      use: {
        baseURL: "http://127.0.0.1:5003",
        viewport: { width: 320, height: 844 },
      },
    },
  ],
  webServer: process.env.ADMIN_MOBILE_PUBLISHED === "1"
    ? publishedAdminWebServer
    : adminWebServer,
});