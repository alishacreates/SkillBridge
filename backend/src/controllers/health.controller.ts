import type { NextFunction, Request, Response } from "express";
import type { AppConfig } from "../config/env.js";
import { checkDatabaseHealth } from "../services/health.service.js";
import type { HealthRequest } from "../validators/health.validator.js";
import { sendSuccess } from "../utils/api-response.js";

export function createGetHealth(config: AppConfig) {
  return async function getHealth(
    _request: Request,
    response: Response,
    _next: NextFunction,
    validated: HealthRequest,
  ): Promise<void> {
    const data = {
      status: "ok",
      service: "skillbridge-api",
      ...(validated.query.details === "true"
        ? {
            environment: config.nodeEnv,
            uptimeSeconds: process.uptime(),
          }
        : {}),
    };

    sendSuccess(response, data);
  };
}

export async function getDatabaseHealth(
  _request: Request,
  response: Response,
): Promise<void> {
  await checkDatabaseHealth();
  sendSuccess(response, { status: "ok", database: "reachable" });
}
