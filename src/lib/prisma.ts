import { Prisma, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: any };

const isProd = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL;
const accelerateUrl =
  process.env.PRISMA_ACCELERATE_URL ||
  (databaseUrl?.startsWith("prisma+postgres://") ? databaseUrl : undefined);

let prismaClient: any;
const logLevels: Prisma.LogLevel[] = isProd
  ? ["error"]
  : ["query", "error", "warn"];
const createUnavailableClient = (message: string) =>
  new Proxy(
    {},
    {
      get: () => () => {
        throw new Error(message);
      },
    }
  );

if (!databaseUrl && !accelerateUrl) {
  // No database configuration available.
  console.warn(
    "Prisma is not configured: set PRISMA_ACCELERATE_URL or DATABASE_URL."
  );
  prismaClient = createUnavailableClient(
    "Prisma client not initialized. Missing PRISMA_ACCELERATE_URL/DATABASE_URL."
  );
} else {
  // Prisma 7 in this project is configured for engineType "client":
  // it needs Accelerate URL (or a driver adapter) at construction time.
  if (!accelerateUrl) {
    console.warn(
      "Prisma client not created at startup: set PRISMA_ACCELERATE_URL (or add a Prisma driver adapter)."
    );
    prismaClient = createUnavailableClient(
      "Prisma client failed to initialize. Set PRISMA_ACCELERATE_URL in Vercel (Build + Runtime env) or configure a Prisma driver adapter."
    );
  } else {
    try {
      prismaClient = new PrismaClient({
        accelerateUrl,
        log: logLevels,
      }).$extends(withAccelerate());
    } catch (error) {
      console.error("Failed to initialize Prisma client:", error);
      prismaClient = createUnavailableClient(
        "Prisma client failed to initialize. Verify PRISMA_ACCELERATE_URL in deployment env vars."
      );
    }
  }
}

export const prisma = globalForPrisma.prisma || prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
