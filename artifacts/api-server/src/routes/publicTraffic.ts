import { Router } from "express";
import type { Request, Response } from "express";
import { checkImageTraffic } from "../lib/publicTrafficProtection";
import path from "node:path";
import { existsSync } from "node:fs";

const router = Router();
const PUBLIC_ASSET_ROOT = [
  path.resolve(process.cwd(), "artifacts/omniqure/public"),
  path.resolve(process.cwd(), "../omniqure/public"),
  path.resolve(import.meta.dirname, "../../omniqure/public"),
].find(existsSync);

router.get("/catalogue-assets/*assetPath", (req: Request, res: Response): void => {
  const rawAssetPath = req.params.assetPath;
  const assetPath = Array.isArray(rawAssetPath) ? rawAssetPath.join("/") : String(rawAssetPath ?? "");
  if (!PUBLIC_ASSET_ROOT || !assetPath || !/\.(?:avif|gif|jpe?g|png|svg|webp|ico)$/i.test(assetPath)) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.sendFile(assetPath, { root: PUBLIC_ASSET_ROOT, dotfiles: "deny" }, (err) => {
    if (err && !res.headersSent) res.status(404).json({ error: "Not found" });
  });
});

// The storefront preview server calls this over loopback before serving an
// image. It forwards the original visitor headers so image traffic shares the
// same durable limiter as API traffic.
router.get("/traffic/image", async (req: Request, res: Response): Promise<void> => {
  const remoteAddress = req.socket.remoteAddress;
  if (remoteAddress !== "127.0.0.1" && remoteAddress !== "::1" && remoteAddress !== "::ffff:127.0.0.1") {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const path = typeof req.headers["x-original-path"] === "string"
    ? req.headers["x-original-path"]
    : "/";
  const decision = await checkImageTraffic(req, path);
  if (!decision.allowed) {
    if (decision.retryAfterSeconds) res.setHeader("Retry-After", String(decision.retryAfterSeconds));
    res.status(decision.status).json({
      error: decision.status === 403 ? "Access denied." : "Too many public requests. Please retry shortly.",
    });
    return;
  }
  res.status(204).send();
});

export default router;