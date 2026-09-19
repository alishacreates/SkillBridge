import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import type { AppConfig } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { createErrorHandler } from "./error-handler.js";

const config: AppConfig = {
  nodeEnv: "development",
  port: 3000,
  databaseUrl: "postgresql://test:test@localhost:5432/skillbridge_test",
  jwtSecret: "12345678901234567890123456789012",
  jwtExpiresIn: "15m",
  frontendUrl: undefined,
};

describe("centralized error handling", () => {
  it("logs but does not expose non-operational error details", async () => {
    const internalError = new AppError({
      statusCode: 500,
      code: "PROFILE_INTEGRITY_ERROR",
      message: "Student profile missing for user 123",
      isOperational: false,
    });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const app = express();
    app.get("/failure", () => {
      throw internalError;
    });
    app.use(createErrorHandler(config));

    const response = await request(app).get("/failure");

    expect(consoleError).toHaveBeenCalledWith(internalError);
    expect(response.status).toBe(500);
    expect(response.body.error).toEqual({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
    consoleError.mockRestore();
  });
});
