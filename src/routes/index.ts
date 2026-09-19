import { Router } from "express";
import type { AppConfig } from "../config/env.js";
import { createAuthRouter } from "./auth.routes.js";
import { createHealthRouter } from "./health.routes.js";

export function createApiRouter(config: AppConfig): Router {
  const router = Router();

  router.use("/auth", createAuthRouter(config));
  router.use("/health", createHealthRouter(config));

  return router;
}
