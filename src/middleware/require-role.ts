import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/prisma/client.js";
import type { OptionalAuthLocals } from "../types/auth.js";
import { AppError } from "../utils/app-error.js";

export function requireRole(...allowedRoles: UserRole[]) {
  return function authorizeRole(
    _request: Request,
    response: Response<unknown, OptionalAuthLocals>,
    next: NextFunction,
  ): void {
    const auth = response.locals.auth;

    if (!auth) {
      throw new AppError({
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required",
      });
    }

    if (!allowedRoles.includes(auth.role)) {
      throw new AppError({
        statusCode: 403,
        code: "FORBIDDEN",
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
}
