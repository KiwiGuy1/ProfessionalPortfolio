import { Prisma, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const isProd = process.env.NODE_ENV === "production";
const logLevels: Prisma.LogLevel[] = isProd
  ? ["error"]
  : ["query", "error", "warn"];

type PrismaSingleton = PrismaClient;

const createPrismaClient = (accelerateUrl: string) =>
  new PrismaClient({
    accelerateUrl,
    log: logLevels,
  }).$extends(withAccelerate()) as unknown as PrismaSingleton;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaSingleton;
};

const prismaDatabaseUrl = process.env.PRISMA_DATABASE_URL;
const resolveDatabaseUrl = () =>
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  (prismaDatabaseUrl?.startsWith("postgres://") ? prismaDatabaseUrl : undefined);
const databaseUrl = resolveDatabaseUrl();
const resolveAccelerateUrl = () =>
  process.env.PRISMA_ACCELERATE_URL ||
  (prismaDatabaseUrl?.startsWith("prisma+postgres://")
    ? prismaDatabaseUrl
    : undefined) ||
  (databaseUrl?.startsWith("prisma+postgres://") ? databaseUrl : undefined);
const accelerateUrl = resolveAccelerateUrl();

let prismaClient: PrismaSingleton;
const createUnavailableClient = (message: string): PrismaSingleton =>
  new Proxy(
    {},
    {
      get: () => () => {
        throw new Error(message);
      },
    }
  ) as unknown as PrismaSingleton;

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
      prismaClient = createPrismaClient(accelerateUrl);
    } catch (error) {
      console.error("Failed to initialize Prisma client:", error);
      prismaClient = createUnavailableClient(
        "Prisma client failed to initialize. Verify PRISMA_ACCELERATE_URL in deployment env vars."
      );
    }
  }
}

export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
