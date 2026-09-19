import express from "express";
import { SignJWT } from "jose";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppConfig } from "../config/env.js";
import { UserRole } from "../generated/prisma/client.js";
import { createAccessToken } from "../utils/token.js";
import { createAuthenticate } from "./authenticate.js";
import { createErrorHandler } from "./error-handler.js";

const userFindUnique = vi.hoisted(() => vi.fn());

vi.mock("../lib/prisma.js", () => ({
  getPrisma: () => ({ user: { findUnique: userFindUnique } }),
}));

const config: AppConfig = {
  nodeEnv: "test",
  port: 3000,
  databaseUrl: "postgresql://test:test@localhost:5432/skillbridge_test",
  jwtSecret: "12345678901234567890123456789012",
  jwtExpiresIn: "15m",
  frontendUrl: undefined,
};
const userId = "46b9d2ab-9b98-4e8c-a91e-341a7b264ca9";

function createTestApp() {
  const app = express();
  app.get("/protected", createAuthenticate(config), (_request, response) => {
    response.json({ auth: response.locals.auth });
  });
  app.use(createErrorHandler(config));
  return app;
}

describe("authenticate middleware", () => {
  beforeEach(() => vi.clearAllMocks());

  it("verifies the token and attaches the current database identity", async () => {
    const token = await createAccessToken(userId, config);
    userFindUnique.mockResolvedValue({ id: userId, role: UserRole.ADMIN });

    const response = await request(createTestApp())
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ auth: { userId, role: "ADMIN" } });
    expect(userFindUnique).toHaveBeenCalledWith({
      where: { id: userId },
      select: { id: true, role: true },
    });
  });

  it("uses the database role even when a token contains a stale role claim", async () => {
    const token = await new SignJWT({ role: UserRole.RECRUITER })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setIssuer("skillbridge-api")
      .setAudience("skillbridge-api")
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(new TextEncoder().encode(config.jwtSecret));
    userFindUnique.mockResolvedValue({ id: userId, role: UserRole.STUDENT });

    const response = await request(createTestApp())
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.auth.role).toBe("STUDENT");
  });

  it.each([undefined, "Basic abc", "Bearer", "Bearer one two"])(
    "rejects a missing or malformed Authorization header: %s",
    async (authorization) => {
      const call = request(createTestApp()).get("/protected");
      if (authorization !== undefined) call.set("Authorization", authorization);

      const response = await call;

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
      expect(userFindUnique).not.toHaveBeenCalled();
    },
  );

  it("rejects an invalid or expired token", async () => {
    const response = await request(createTestApp())
      .get("/protected")
      .set("Authorization", "Bearer not-a-token");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_TOKEN");
    expect(userFindUnique).not.toHaveBeenCalled();
  });

  it("returns USER_NOT_FOUND when a valid token references a deleted user", async () => {
    const token = await createAccessToken(userId, config);
    userFindUnique.mockResolvedValue(null);

    const response = await request(createTestApp())
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("USER_NOT_FOUND");
  });

  it("propagates unexpected database failures to centralized handling", async () => {
    const token = await createAccessToken(userId, config);
    userFindUnique.mockRejectedValue(new Error("database unavailable"));

    const response = await request(createTestApp())
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toEqual({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  });
});
