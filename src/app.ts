import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import type { AppConfig } from "./config/env.js";
import { createErrorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { createApiRouter } from "./routes/index.js";

export function createApp(config: AppConfig): Express {
  const app = express();
  const origin =
    config.frontendUrl ?? (config.nodeEnv === "production" ? false : true);

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin }));
  app.use(express.json({ limit: "1mb" }));
  app.use("/api", createApiRouter(config));
  app.use(notFoundHandler);
  app.use(createErrorHandler(config));

  return app;
}
