import { Router } from "express";
import type { AppConfig } from "../config/env.js";
import {
  createLogin,
  currentUser,
  register,
} from "../controllers/auth.controller.js";
import { createAuthenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validate-request.js";
import {
  loginRequestSchema,
  registerRequestSchema,
} from "../validators/auth.validator.js";

export function createAuthRouter(config: AppConfig): Router {
  const router = Router();

  router.post("/register", validateRequest(registerRequestSchema, register));
  router.post("/login", validateRequest(loginRequestSchema, createLogin(config)));
  router.get("/me", createAuthenticate(config), currentUser);

  return router;
}
