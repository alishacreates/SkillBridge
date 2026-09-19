import "dotenv/config";
import { z } from "zod";

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().url().optional(),
);

export type JwtDuration = `${number}${"m" | "h" | "d"}`;

const jwtDurationSchema = z.custom<JwtDuration>(
  (value) => typeof value === "string" && /^[1-9][0-9]*(m|h|d)$/.test(value),
  "JWT_EXPIRES_IN must use a duration such as 15m, 1h, or 1d",
);

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    PORT: z.coerce.number().int().min(1).max(65_535),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().refine((secret) => Buffer.byteLength(secret, "utf8") >= 32, {
      message: "JWT_SECRET must contain at least 32 UTF-8 bytes",
    }),
    JWT_EXPIRES_IN: jwtDurationSchema,
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
  jwtSecret: string;
  jwtExpiresIn: JwtDuration;
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
