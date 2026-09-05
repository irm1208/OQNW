export const adminWebServer = [
  {
    command:
      "PORT=8080 CORS_ALLOWED_ORIGINS=http://127.0.0.1:5002,http://127.0.0.1:5003 pnpm --filter @workspace/api-server run dev",
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

export const publishedAdminWebServer = [
  {
    command:
      "PORT=8084 CORS_ALLOWED_ORIGINS=http://127.0.0.1:5003,http://127.0.0.1:5004 pnpm --filter @workspace/api-server run dev",
    url: "http://127.0.0.1:8084/",
    timeout: 120_000,
    reuseExistingServer: true,
  },
  {
    command:
      "PORT=5004 BASE_PATH=/ API_PORT=8084 pnpm --filter @workspace/admin-panel run dev",
    url: "http://127.0.0.1:5004/login",
    timeout: 120_000,
    reuseExistingServer: true,
  },
  {
    command:
      "NODE_ENV=production PORT=5003 BASE_PATH=/imtheonlyadmin/ API_PORT=8084 pnpm --filter @workspace/admin-panel run build && NODE_ENV=production PORT=5003 BASE_PATH=/imtheonlyadmin/ API_PORT=8084 pnpm --filter @workspace/admin-panel run serve",
    url: "http://127.0.0.1:5003/imtheonlyadmin/login",
    timeout: 120_000,
    reuseExistingServer: false,
  },
];