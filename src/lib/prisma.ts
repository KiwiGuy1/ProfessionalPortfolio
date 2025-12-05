import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: any };

const isProd = process.env.NODE_ENV === "production";
const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
const databaseUrl = process.env.DATABASE_URL;

// Only initialize Prisma if we have a database URL (skip during build)
let prismaClient: any;

if (!databaseUrl && !accelerateUrl) {
  // During build, DATABASE_URL won't be available, return a proxy
  prismaClient = new Proxy(
    {},
    {
      get: () => () => {
        throw new Error("Prisma not initialized - no database URL provided");
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
    console.error("Failed to initialize Prisma:", error);
    prismaClient = new Proxy(
      {},
      {
        get: () => () => {
          throw new Error("Prisma initialization failed");
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
