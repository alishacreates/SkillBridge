import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

let prismaClient: PrismaClient | undefined;

export function initializePrisma(databaseUrl: string): PrismaClient {
  if (!prismaClient) {
    const adapter = new PrismaPg({ connectionString: databaseUrl });
    prismaClient = new PrismaClient({ adapter });
  }

  return prismaClient;
}

export function getPrisma(): PrismaClient {
  if (!prismaClient) {
    throw new Error("Prisma has not been initialized");
  }

  return prismaClient;
}

export async function disconnectPrisma(): Promise<void> {
  if (!prismaClient) {
    return;
  }

  const client = prismaClient;
  prismaClient = undefined;
  await client.$disconnect();
}
