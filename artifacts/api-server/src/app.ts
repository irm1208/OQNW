import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import sitemapRouter from "./routes/sitemap";
import { logger } from "./lib/logger";

const app: Express = express();

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
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
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

app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
// Dynamic sitemap — served at /sitemap.xml (outside /api prefix so robots.txt can reference it directly)
app.use(sitemapRouter);
app.use("/api", router);

export default app;
