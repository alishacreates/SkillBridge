import { getPrisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";

export async function checkDatabaseHealth(): Promise<void> {
  try {
    await getPrisma().$queryRaw`SELECT 1`;
  } catch {
    throw new AppError({
      statusCode: 503,
      code: "DATABASE_UNAVAILABLE",
      message: "Database is unavailable",
    });
  }
}
