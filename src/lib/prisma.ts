import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use Accelerate only in production (Vercel). Local dev uses direct connection
const isProd = process.env.NODE_ENV === "production";
const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;

export const prisma =
  globalForPrisma.prisma ||
  (isProd
    ? new PrismaClient({
        accelerateUrl,
        log: ["error"],
      }).$extends(withAccelerate())
    : new PrismaClient({
        log: ["query", "error", "warn"],
      }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
