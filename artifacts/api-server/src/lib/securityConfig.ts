const isProduction = process.env.NODE_ENV === "production";

export function requiredSecret(name: "ADMIN_PASSWORD" | "SESSION_SECRET", developmentFallback: string): string {
  const configured = process.env[name];
  if (configured) return configured;
  if (isProduction) {
    throw new Error(`${name} must be configured in production`);
  }
  return developmentFallback;
}

export function allowedBrowserOrigins(): Set<string> {
  const configured = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const origins = new Set([
    "https://omniqure.com",
    "https://www.omniqure.com",
    ...configured,
  ]);

  if (!isProduction) {
    origins.add("http://localhost:5000");
    origins.add("http://localhost:8081");
    origins.add("http://localhost:8082");
    origins.add("http://127.0.0.1:5000");
    origins.add("http://127.0.0.1:8081");
    origins.add("http://127.0.0.1:8082");
  }

  const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;
  if (replitDevDomain) origins.add(`https://${replitDevDomain}`);

  return origins;
}