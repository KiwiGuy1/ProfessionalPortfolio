import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: any };

const isProd = process.env.NODE_ENV === "production";
const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
const databaseUrl = process.env.DATABASE_URL;

// Detect if we're in build mode (no connection possible)
const isBuild =
  process.env.VERCEL_ENV === "preview" ||
  process.env.VERCEL_ENV === "production" ||
  process.argv.includes("next build");

let prismaClient: any;

if (!databaseUrl && !accelerateUrl) {
  // No database URL available - return a proxy to avoid build errors
  console.warn("DATABASE_URL not available, Prisma client will be unavailable");
  prismaClient = new Proxy(
    {},
    {
      get: () => () => {
        throw new Error(
          "Prisma client not initialized - DATABASE_URL is missing. This should only happen during build."
        );
      },
    }
  );
} else {
  try {
    if (accelerateUrl) {
      prismaClient = new PrismaClient({
        accelerateUrl,
        log: isProd ? ["error"] : ["query", "error", "warn"],
      }).$extends(withAccelerate());
    } else {
      prismaClient = new PrismaClient({
        log: isProd ? ["error"] : ["query", "error", "warn"],
      });
    }
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    // Return a proxy as fallback
    prismaClient = new Proxy(
      {},
      {
        get: () => () => {
          throw new Error("Prisma client failed to initialize");
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
