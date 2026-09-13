import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "./app.js";
import type { AppConfig } from "./config/env.js";

const { databaseQueryMock } = vi.hoisted(() => ({
  databaseQueryMock: vi.fn(),
}));

vi.mock("./lib/prisma.js", () => ({
  getPrisma: () => ({ $queryRaw: databaseQueryMock }),
}));

const testConfig: AppConfig = {
  nodeEnv: "test",
  port: 3000,
  databaseUrl: "postgresql://test:test@localhost:5432/skillbridge_test",
  jwtSecret: undefined,
  jwtExpiresIn: undefined,
  frontendUrl: "https://app.skillbridge.test",
};

describe("SkillBridge API infrastructure", () => {
  const app = createApp(testConfig);

  beforeEach(() => {
    databaseQueryMock.mockReset();
  });

  it("returns basic service health without query parameters", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: "ok",
        service: "skillbridge-api",
      },
    });
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("includes safe details only when details=true", async () => {
    const response = await request(app).get("/api/health?details=true");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: "ok",
        service: "skillbridge-api",
        environment: "test",
        uptimeSeconds: expect.any(Number),
      },
    });
  });

  it("returns basic health when details=false", async () => {
    const response = await request(app).get("/api/health?details=false");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      status: "ok",
      service: "skillbridge-api",
    });
  });

  it("rejects unsupported details values with validation issues", async () => {
    const response = await request(app).get("/api/health?details=yes");

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: [
          {
            path: ["query", "details"],
          },
        ],
      },
    });
  });

  it("returns a structured error for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/health")
      .set("Content-Type", "application/json")
      .send('{"broken"');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "MALFORMED_JSON",
        message: "Malformed JSON request body",
      },
    });
  });

  it("uses the configured frontend origin for CORS", async () => {
    const response = await request(app)
      .get("/api/health")
      .set("Origin", "https://app.skillbridge.test");

    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://app.skillbridge.test",
    );
  });

  it("returns the standard envelope for unknown routes", async () => {
    const response = await request(app).get("/api/not-real");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "Route not found",
      },
    });
  });

  it("reports database health when PostgreSQL is reachable", async () => {
    databaseQueryMock.mockResolvedValue([{ result: 1 }]);

    const response = await request(app).get("/api/health/db");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: "ok",
        database: "reachable",
      },
    });
    expect(databaseQueryMock).toHaveBeenCalledOnce();
  });

  it("returns a safe service-unavailable error when PostgreSQL is unreachable", async () => {
    databaseQueryMock.mockRejectedValue(new Error("connection details are private"));

    const response = await request(app).get("/api/health/db");

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Database is unavailable",
      },
    });
    expect(JSON.stringify(response.body)).not.toContain("connection details");
  });
});
