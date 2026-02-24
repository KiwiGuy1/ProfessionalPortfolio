import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: any };

const isProd = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL;
const accelerateUrl =
  process.env.PRISMA_ACCELERATE_URL ||
  (databaseUrl?.startsWith("prisma+postgres://") ? databaseUrl : undefined);

let prismaClient: any;
const logLevels = isProd ? ["error"] : ["query", "error", "warn"];

if (!databaseUrl && !accelerateUrl) {
  // No database configuration available.
  console.warn(
    "Prisma is not configured: set PRISMA_ACCELERATE_URL or DATABASE_URL."
  );
  prismaClient = new Proxy(
    {},
    {
      get: () => () => {
        throw new Error(
          "Prisma client not initialized. Missing PRISMA_ACCELERATE_URL/DATABASE_URL."
        );
      },
    }
  );
} else {
  try {
    if (accelerateUrl) {
      prismaClient = new PrismaClient({
        accelerateUrl,
        log: logLevels,
      }).$extends(withAccelerate());
    } else {
      // Prisma 7 with engineType "client" needs accelerateUrl or a DB adapter.
      throw new Error(
        "PrismaClient requires PRISMA_ACCELERATE_URL (or a driver adapter). DATABASE_URL alone is not supported in this setup."
      );
    }
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    prismaClient = new Proxy(
      {},
      {
        get: () => () => {
          throw new Error(
            "Prisma client failed to initialize. Verify PRISMA_ACCELERATE_URL in deployment env vars."
          );
        },
      }
    );
  }
}

export const prisma = globalForPrisma.prisma || prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
