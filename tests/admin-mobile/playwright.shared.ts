export const adminWebServer = [
  {
    command: "pnpm --filter @workspace/api-server run dev",
    url: "http://127.0.0.1:8080/",
    timeout: 120_000,
    reuseExistingServer: true,
  },
  {
    command: "PORT=5002 BASE_PATH=/ API_PORT=8080 pnpm --filter @workspace/admin-panel run dev",
    url: "http://127.0.0.1:5002/login",
    timeout: 120_000,
    reuseExistingServer: true,
  },
];