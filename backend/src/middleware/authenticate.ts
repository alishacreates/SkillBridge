import type { NextFunction, Request, Response } from "express";
import type { AppConfig } from "../config/env.js";
import { getPrisma } from "../lib/prisma.js";
import type { OptionalAuthLocals } from "../types/auth.js";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/token.js";

function authenticationRequired(): AppError {
  return new AppError({
    statusCode: 401,
    code: "AUTHENTICATION_REQUIRED",
    message: "Bearer authentication is required",
  });
}

export function createAuthenticate(config: AppConfig) {
  return async function authenticate(
    request: Request,
    response: Response<unknown, OptionalAuthLocals>,
    next: NextFunction,
  ): Promise<void> {
    const authorization = request.get("authorization");
    const match = authorization?.match(/^Bearer ([^\s]+)$/i);

    if (!match) {
      throw authenticationRequired();
    }

    const token = match[1];
    if (!token) {
      throw authenticationRequired();
    }

    const { userId } = await verifyAccessToken(token, config);
    const user = await getPrisma().user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new AppError({
        statusCode: 401,
        code: "USER_NOT_FOUND",
        message: "The authenticated user no longer exists",
      });
    }

    response.locals.auth = { userId: user.id, role: user.role };
    next();
  };
}
