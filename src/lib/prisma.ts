import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const isProd = process.env.NODE_ENV === "production";
const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;

let prismaClient: any;

if (accelerateUrl) {
  // Use Accelerate if URL is configured
  prismaClient = new PrismaClient({
    accelerateUrl,
    log: isProd ? ["error"] : ["query", "error", "warn"],
  }).$extends(withAccelerate());
} else {
  // Fall back to direct connection
  prismaClient = new PrismaClient({
    log: isProd ? ["error"] : ["query", "error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma || prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
