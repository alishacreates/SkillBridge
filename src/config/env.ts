import "dotenv/config";
import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().url().optional(),
);

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    PORT: z.coerce.number().int().min(1).max(65_535),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: optionalString,
    JWT_EXPIRES_IN: optionalString,
    FRONTEND_URL: optionalUrl,
  })
  .superRefine((environment, context) => {
    if (environment.NODE_ENV === "production" && !environment.FRONTEND_URL) {
      context.addIssue({
        code: "custom",
        path: ["FRONTEND_URL"],
        message: "FRONTEND_URL is required in production",
      });
    }
  });

export interface AppConfig {
  nodeEnv: "development" | "test" | "production";
  port: number;
  databaseUrl: string;
  jwtSecret: string | undefined;
  jwtExpiresIn: string | undefined;
  frontendUrl: string | undefined;
}

export function loadConfig(source: NodeJS.ProcessEnv = process.env): AppConfig {
  const environment = environmentSchema.parse(source);

  return {
    nodeEnv: environment.NODE_ENV,
    port: environment.PORT,
    databaseUrl: environment.DATABASE_URL,
    jwtSecret: environment.JWT_SECRET,
    jwtExpiresIn: environment.JWT_EXPIRES_IN,
    frontendUrl: environment.FRONTEND_URL,
  };
}
