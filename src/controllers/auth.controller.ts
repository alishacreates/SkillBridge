import type { NextFunction, Request, Response } from "express";
import type { AppConfig } from "../config/env.js";
import { getCurrentUser, login, registerUser } from "../services/auth.service.js";
import type { AuthLocals } from "../types/auth.js";
import { sendSuccess } from "../utils/api-response.js";
import type {
  LoginRequest,
  RegisterRequest,
} from "../validators/auth.validator.js";

export async function register(
  _request: Request,
  response: Response,
  _next: NextFunction,
  validated: RegisterRequest,
): Promise<void> {
  const result = await registerUser(validated.body);
  sendSuccess(response, result, 201);
}

export function createLogin(config: AppConfig) {
  return async function loginController(
    _request: Request,
    response: Response,
    _next: NextFunction,
    validated: LoginRequest,
  ): Promise<void> {
    const result = await login(validated.body, config);
    sendSuccess(response, result);
  };
}

export async function currentUser(
  _request: Request,
  response: Response<unknown, AuthLocals>,
): Promise<void> {
  const { userId, role } = response.locals.auth;
  const result = await getCurrentUser(userId, role);
  sendSuccess(response, result);
}
