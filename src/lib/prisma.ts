import pkg from "@prisma/client";
const { PrismaClient } = pkg;

declare global {
  var prisma: InstanceType<typeof PrismaClient> | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
