import { Router } from "express";
import type { AppConfig } from "../config/env.js";
import {
  createGetHealth,
  getDatabaseHealth,
} from "../controllers/health.controller.js";
import { validateRequest } from "../middleware/validate-request.js";
import { healthRequestSchema } from "../validators/health.validator.js";

export function createHealthRouter(config: AppConfig): Router {
  const router = Router();

  router.get("/db", getDatabaseHealth);
  router.get("/", validateRequest(healthRequestSchema, createGetHealth(config)));

  return router;
}
