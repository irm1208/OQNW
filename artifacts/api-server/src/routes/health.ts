import { Router, type IRouter, type Request, type Response } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

function respondHealthy(_req: Request, res: Response) {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
}

// The deployment health probe requests /api while local checks use /api/healthz.
// Keep both paths equivalent so autoscale startup does not reject a healthy API.
router.get("/", respondHealthy);
router.get("/healthz", respondHealthy);

export default router;
