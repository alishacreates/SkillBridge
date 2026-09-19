import { describe, expect, it } from "vitest";
import { loadConfig } from "./env.js";

const baseEnvironment = {
  NODE_ENV: "development",
  PORT: "3000",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/skillbridge",
  JWT_SECRET: "12345678901234567890123456789012",
  JWT_EXPIRES_IN: "15m",
};

describe("loadConfig", () => {
  it("parses the required development configuration", () => {
    const config = loadConfig(baseEnvironment);

    expect(config).toMatchObject({
      nodeEnv: "development",
      port: 3000,
      databaseUrl: baseEnvironment.DATABASE_URL,
    });
  });

  it("rejects missing required values", () => {
    expect(() => loadConfig({ NODE_ENV: "development", PORT: "3000" })).toThrow();
  });

  it("requires FRONTEND_URL in production", () => {
    expect(() =>
      loadConfig({ ...baseEnvironment, NODE_ENV: "production" }),
    ).toThrow(/FRONTEND_URL/);
  });

  it("accepts a configured production frontend", () => {
    const config = loadConfig({
      ...baseEnvironment,
      NODE_ENV: "production",
      FRONTEND_URL: "https://skillbridge.example.com",
    });

    expect(config.frontendUrl).toBe("https://skillbridge.example.com");
  });

  it("rejects ports outside the TCP range", () => {
    expect(() => loadConfig({ ...baseEnvironment, PORT: "70000" })).toThrow();
  });

  it("requires authentication configuration", () => {
    const { JWT_SECRET: _secret, ...withoutSecret } = baseEnvironment;

    expect(() => loadConfig(withoutSecret)).toThrow(/JWT_SECRET/);
  });

  it("enforces JWT secret length using UTF-8 bytes", () => {
    expect(() =>
      loadConfig({ ...baseEnvironment, JWT_SECRET: "1234567890123456789012345678901" }),
    ).toThrow(/JWT_SECRET/);

    expect(loadConfig({ ...baseEnvironment, JWT_SECRET: "🔐🔐🔐🔐🔐🔐🔐🔐" }).jwtSecret).toBe(
      "🔐🔐🔐🔐🔐🔐🔐🔐",
    );
  });

  it.each(["15m", "1h", "1d"])("accepts controlled JWT duration %s", (duration) => {
    expect(loadConfig({ ...baseEnvironment, JWT_EXPIRES_IN: duration }).jwtExpiresIn).toBe(
      duration,
    );
  });

  it.each(["0m", "15minutes", "1w", "later"])(
    "rejects unsupported JWT duration %s",
    (duration) => {
      expect(() =>
        loadConfig({ ...baseEnvironment, JWT_EXPIRES_IN: duration }),
      ).toThrow(/JWT_EXPIRES_IN/);
    },
  );
});
