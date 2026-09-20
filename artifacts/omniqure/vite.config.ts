import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { injectSeoIntoHtml, routeFromHtmlUrl, seoForApiRecord, seoForReferral } from "./src/seo/prerender";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

const seoApiBaseUrl = `http://127.0.0.1:${process.env.API_PORT || 8080}`;

type InitialSeoResult =
  | { kind: "not-seo-route" | "not-found" }
  | { kind: "available"; seo: ReturnType<typeof seoForApiRecord> }
  | { kind: "unavailable" };

async function fetchInitialSeo(url: string) {
  const route = routeFromHtmlUrl(url);
  if (!route) return { kind: "not-seo-route" } as const;
  if (route.kind === "referral") {
    return { kind: "available", seo: seoForReferral() } as const;
  }

  const endpoint = route.kind === "product" ? "products" : "blog/posts";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2_000);
    try {
      const response = await fetch(
        `${seoApiBaseUrl}/api/${endpoint}/${encodeURIComponent(route.slug)}`,
        { signal: controller.signal, headers: { accept: "application/json" } },
      );
      if (response.status === 404) return { kind: "not-found" } as const;
      if (response.ok) {
        return {
          kind: "available",
          seo: seoForApiRecord(route.kind, await response.json()),
        } as const;
      }
    } catch {
      // Retry to cover the API's short startup window before returning 503.
    } finally {
      clearTimeout(timeout);
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  return { kind: "unavailable" } as const;
}

function routeSeoPlugin() {
  return {
    name: "omniqure-route-seo",
    configureServer(server: {
      middlewares: {
        use: (handler: (
          req: { method?: string; url?: string },
          res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body?: string) => void },
          next: () => void,
        ) => void | Promise<void>) => void;
      };
      transformIndexHtml: (url: string, html: string) => Promise<string>;
      config: { root: string };
    }) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        const url = req.url ?? "/";
        const result: InitialSeoResult = await fetchInitialSeo(url);
        if (result.kind === "not-seo-route" || result.kind === "not-found") return next();
        if (result.kind === "unavailable") {
          res.statusCode = 503;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.setHeader("Retry-After", "5");
          res.end(req.method === "HEAD" ? undefined : "SEO metadata is temporarily unavailable. Please retry.");
          return;
        }

        const shell = await readFile(path.join(server.config.root, "index.html"), "utf8");
        const transformed = injectSeoIntoHtml(
          await server.transformIndexHtml(url, shell),
          result.seo,
        );
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(req.method === "HEAD" ? undefined : transformed);
      });
    },
    configurePreviewServer(server: {
      middlewares: {
        use: (handler: (
          req: { method?: string; url?: string },
          res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body?: string) => void },
          next: () => void,
        ) => void | Promise<void>) => void;
      };
      config: { build: { outDir: string } };
    }) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        const result: InitialSeoResult = await fetchInitialSeo(req.url ?? "/");
        if (result.kind === "not-seo-route" || result.kind === "not-found") return next();
        if (result.kind === "unavailable") {
          res.statusCode = 503;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.setHeader("Retry-After", "5");
          res.end(req.method === "HEAD" ? undefined : "SEO metadata is temporarily unavailable. Please retry.");
          return;
        }

        const shell = await readFile(path.join(server.config.build.outDir, "index.html"), "utf8");
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(req.method === "HEAD" ? undefined : injectSeoIntoHtml(shell, result.seo));
      });
    },
  };
}

function imageTrafficProtectionPlugin() {
  type MiddlewareRequest = {
    method?: string;
    url?: string;
    headers: Record<string, string | string[] | undefined>;
  };
  type MiddlewareResponse = {
    statusCode: number;
    setHeader: (name: string, value: string) => void;
    end: (body?: string) => void;
  };
  type MiddlewareServer = {
    middlewares: {
      use: (handler: (
        req: MiddlewareRequest,
        res: MiddlewareResponse,
        next: () => void,
      ) => void | Promise<void>) => void;
    };
  };

  function install(server: MiddlewareServer) {
    server.middlewares.use(async (req, res, next) => {
      if (req.method !== "GET" && req.method !== "HEAD") return next();
      const requestUrl = req.url ?? "/";
      // Vite serves imported image modules with ?import. These requests are
      // part of the JavaScript module graph, not public image downloads; a
      // limiter response here makes lazy-loaded pages fail to import.
      if (/[?&]import(?:[=&]|$)/.test(requestUrl)) return next();
      const imagePath = requestUrl.split("?")[0];
      if (!/\.(?:avif|gif|jpe?g|png|svg|webp|ico)$/i.test(imagePath)) return next();

      try {
        const forwardedFor = req.headers["x-forwarded-for"];
        const userAgent = req.headers["user-agent"];
        const response = await fetch(`${seoApiBaseUrl}/api/traffic/image`, {
          headers: {
            "x-original-path": imagePath.slice(0, 300),
            ...(typeof forwardedFor === "string" ? { "x-forwarded-for": forwardedFor } : {}),
            ...(typeof userAgent === "string" ? { "user-agent": userAgent.slice(0, 300) } : {}),
          },
          signal: AbortSignal.timeout(1_500),
        });

        if (response.ok) return next();
        // Only an explicit limiter decision should block an image. A missing,
        // unhealthy, or temporarily unavailable limiter endpoint must fail open
        // so local image imports cannot crash the entire storefront.
        if (response.status !== 403 && response.status !== 429) return next();
        res.statusCode = response.status;
        const retryAfter = response.headers.get("retry-after");
        if (retryAfter) res.setHeader("Retry-After", retryAfter);
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(req.method === "HEAD" ? undefined : "Too many public requests. Please retry shortly.");
      } catch {
        // An unavailable limiter must not make public images disappear.
        next();
      }
    });
  }

  return {
    name: "omniqure-image-traffic-protection",
    configureServer: install,
    configurePreviewServer: install,
  };
}

function referralStaticBuildPlugin() {
  return {
    name: "omniqure-referral-static-build",
    apply: "build" as const,
    async closeBundle() {
      const publicDir = path.resolve(import.meta.dirname, "dist/public");
      const shell = await readFile(path.join(publicDir, "index.html"), "utf8");
      for (const route of ["refer-a-friend", "sign-up"]) {
        const referralDir = path.join(publicDir, route);
        await mkdir(referralDir, { recursive: true });
        await writeFile(
          path.join(referralDir, "index.html"),
          injectSeoIntoHtml(shell, seoForReferral()),
          "utf8",
        );
      }
    },
  };
}

function protectedCatalogueBuildPlugin() {
  return {
    name: "omniqure-protected-catalogue-assets",
    apply: "build" as const,
    async closeBundle() {
      // Product images are served through /api/catalogue-assets in production,
      // where the shared limiter runs. Do not leave a duplicate static bypass.
      await rm(path.resolve(import.meta.dirname, "dist/public/products"), {
        recursive: true,
        force: true,
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    routeSeoPlugin(),
    imageTrafficProtectionPlugin(),
    referralStaticBuildPlugin(),
    protectedCatalogueBuildPlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/scheduler")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix";
          }
          if (id.includes("node_modules/@tanstack")) {
            return "vendor-query";
          }
          if (id.includes("node_modules/jspdf") || id.includes("node_modules/canvg") || id.includes("node_modules/dompurify")) {
            return "vendor-pdf";
          }
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
    fs: {
      strict: true,
    },
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.API_PORT || 8080}`,
        changeOrigin: true,
      },
      "/sitemap.xml": {
        target: `http://localhost:${process.env.API_PORT || 8080}`,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
  },
});
