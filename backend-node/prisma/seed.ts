import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@security.local" },
    update: { role: "admin", active: true },
    create: {
      name: "Admin Security",
      email: "admin@security.local",
      password,
      role: "admin",
      active: true
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
