import { createServer, type Server } from "node:http";
import { pathToFileURL } from "node:url";
import { createApp } from "./app.js";
import { loadConfig } from "./config/env.js";
import {
  disconnectPrisma,
  initializePrisma,
} from "./lib/prisma.js";

function listen(server: Server, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, () => {
      server.off("error", reject);
      resolve();
    });
  });
}

function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function registerShutdownHandlers(server: Server): void {
  let isShuttingDown = false;

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    console.log(`Received ${signal}; shutting down`);

    const forceExitTimer = setTimeout(() => {
      console.error("Graceful shutdown timed out");
      process.exit(1);
    }, 10_000);
    forceExitTimer.unref();

    let shutdownError: unknown;

    try {
      await close(server);
    } catch (error: unknown) {
      shutdownError = error;
    }

    try {
      await disconnectPrisma();
    } catch (error: unknown) {
      shutdownError ??= error;
    }

    clearTimeout(forceExitTimer);

    if (shutdownError) {
      console.error("Graceful shutdown failed", shutdownError);
      process.exitCode = 1;
    }
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}

export async function startServer(): Promise<void> {
  const config = loadConfig();
  initializePrisma(config.databaseUrl);

  const app = createApp(config);
  const server = createServer(app);
  await listen(server, config.port);
  registerShutdownHandlers(server);

  console.log(`SkillBridge API listening on port ${config.port}`);
}

async function main(): Promise<void> {
  try {
    await startServer();
  } catch (error: unknown) {
    console.error("Failed to start SkillBridge API", error);
    await disconnectPrisma();
    process.exitCode = 1;
  }
}

const entryPoint = process.argv[1];

if (entryPoint && import.meta.url === pathToFileURL(entryPoint).href) {
  void main();
}
