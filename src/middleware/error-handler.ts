import type { ErrorRequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";
import type { AppConfig } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { sendError } from "../utils/api-response.js";
import { ZodError } from "zod";

function isMalformedJsonError(
  error: unknown,
): error is SyntaxError & { status: number; body: unknown } {
  return (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400 &&
    "body" in error
  );
}

function formatValidationIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    code: issue.code,
    message: issue.message,
    path: issue.path.map((segment) =>
      typeof segment === "symbol" ? segment.toString() : segment,
    ),
  }));
}

export function createErrorHandler(config: AppConfig): ErrorRequestHandler {
  return (error: unknown, _request, response, next) => {
    if (response.headersSent) {
      next(error);
      return;
    }

    if (error instanceof ZodError) {
      sendError(
        response,
        400,
        "VALIDATION_ERROR",
        "Request validation failed",
        formatValidationIssues(error),
      );
      return;
    }

    if (isMalformedJsonError(error)) {
      sendError(response, 400, "MALFORMED_JSON", "Malformed JSON request body");
      return;
    }

    if (error instanceof AppError) {
      if (!error.isOperational) {
        if (config.nodeEnv !== "test") {
          console.error(error);
        }
        sendError(response, 500, "INTERNAL_SERVER_ERROR", "Internal server error");
        return;
      }

      sendError(response, error.statusCode, error.code, error.message, error.details);
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        sendError(response, 404, "RESOURCE_NOT_FOUND", "Resource not found");
        return;
      }

      if (error.code === "P2002") {
        sendError(response, 409, "RESOURCE_CONFLICT", "Resource already exists");
        return;
      }

      sendError(response, 500, "DATABASE_ERROR", "A database operation failed");
      return;
    }

    if (config.nodeEnv !== "test") {
      console.error(error);
    }

    sendError(response, 500, "INTERNAL_SERVER_ERROR", "Internal server error");
  };
}
