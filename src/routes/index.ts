import { Router } from "express";
import type { AppConfig } from "../config/env.js";
import { createHealthRouter } from "./health.routes.js";

export function createApiRouter(config: AppConfig): Router {
  const router = Router();

  router.use("/health", createHealthRouter(config));

  return router;
}
