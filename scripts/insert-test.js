require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");

async function main() {
  const prisma = new PrismaClient({
    accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
    log: ["error"],
  }).$extends(withAccelerate());

  const record = await prisma.collaborationRequest.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      message: "Hello from Prisma test insert",
    },
  });

  console.log("Inserted record:", record);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
