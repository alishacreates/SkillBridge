import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import type { AppConfig } from "../config/env.js";
import { UserRole } from "../generated/prisma/client.js";
import type { AuthLocals } from "../types/auth.js";
import { createErrorHandler } from "./error-handler.js";
import { requireRole } from "./require-role.js";

const config: AppConfig = {
  nodeEnv: "test",
  port: 3000,
  databaseUrl: "postgresql://test:test@localhost:5432/skillbridge_test",
  jwtSecret: "12345678901234567890123456789012",
  jwtExpiresIn: "15m",
  frontendUrl: undefined,
};

function createTestApp(role?: UserRole, allowed: UserRole[] = [UserRole.ADMIN]) {
  const app = express();
  app.get(
    "/role",
    (_request, response, next) => {
      if (role) {
        const locals: AuthLocals = {
          auth: { userId: "46b9d2ab-9b98-4e8c-a91e-341a7b264ca9", role },
        };
        Object.assign(response.locals, locals);
      }
      next();
    },
    requireRole(...allowed),
    (_request, response) => response.json({ allowed: true }),
  );
  app.use(createErrorHandler(config));
  return app;
}

describe("requireRole middleware", () => {
  it.each([
    [[UserRole.STUDENT], UserRole.STUDENT],
    [[UserRole.ADMIN, UserRole.RECRUITER], UserRole.RECRUITER],
  ])("permits a current database role in %j", async (allowed, role) => {
    const response = await request(createTestApp(role, allowed)).get("/role");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ allowed: true });
  });

  it("rejects a current role that is not permitted", async () => {
    const response = await request(
      createTestApp(UserRole.STUDENT, [UserRole.ADMIN]),
    ).get("/role");

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("rejects a missing authentication context", async () => {
    const response = await request(createTestApp()).get("/role");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });
});
