import express, { type ErrorRequestHandler, type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import sitemapRouter from "./routes/sitemap";
import { logger } from "./lib/logger";
import { allowedBrowserOrigins } from "./lib/securityConfig";
import { publicTrafficProtection } from "./lib/publicTrafficProtection";

const app: Express = express();
const trustedOrigins = allowedBrowserOrigins();
const stateChangingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const browserSessionCookies = ["customer_session", "admin_session", "admin_secure_session"];

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  const mutablePublicGet = req.method === "GET" && (
    req.path.startsWith("/api/products") ||
    req.path.startsWith("/api/blog") ||
    req.path.startsWith("/api/store-settings") ||
    req.path.startsWith("/api/shipping") ||
    req.path.startsWith("/api/tax")
  );
  if (
    mutablePublicGet ||
    req.path.startsWith("/api/admin") ||
    req.path.startsWith("/api/account") ||
    req.path.startsWith("/api/auth")
  ) {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || trustedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("CORS origin denied"));
  },
}));
app.use(cookieParser());
app.use((req, res, next) => {
  if (!stateChangingMethods.has(req.method)) {
    next();
    return;
  }

  // CSRF matters when the browser will attach an authenticated cookie. Webhooks
  // and public guest actions do not carry one and remain available to non-browser
  // clients after their own signature or input validation.
  const hasBrowserSession = browserSessionCookies.some((cookieName) => Boolean(req.cookies?.[cookieName]));
  if (!hasBrowserSession) {
    next();
    return;
  }

  const originHeader = req.get("origin");
  let requestOrigin = originHeader || null;
  if (!requestOrigin) {
    const referer = req.get("referer");
    if (referer) {
      try {
        requestOrigin = new URL(referer).origin;
      } catch {
        requestOrigin = null;
      }
    }
  }

  if (!requestOrigin || !trustedOrigins.has(requestOrigin)) {
    res.status(403).json({ error: "Request origin not allowed" });
    return;
  }

  next();
});
app.use(publicTrafficProtection);
// Attach the raw request buffer to `req` so webhook handlers can verify
// HMAC signatures against the original bytes rather than re-serialised JSON.
app.use(
  express.json({
    verify: (req: express.Request & { rawBody?: Buffer }, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: true }));

// Health check — autoscale startup probe hits GET / and requires HTTP 200
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Dynamic sitemap — support the API path requested by crawlers and the legacy root alias.
app.use(sitemapRouter);
app.use("/api", router);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof Error && err.message === "CORS origin denied") {
    res.status(403).json({ error: "Origin not allowed" });
    return;
  }
  req.log?.error({ err }, "Unhandled request error");
  res.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);

export default app;
