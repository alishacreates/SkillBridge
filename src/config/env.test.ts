import { describe, expect, it } from "vitest";
import { loadConfig } from "./env.js";

const baseEnvironment = {
  NODE_ENV: "development",
  PORT: "3000",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/skillbridge",
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
});
