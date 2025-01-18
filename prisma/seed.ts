import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const adminExists = await prisma.user.findUnique({
    where: {
      email: "wabelwilson@gmail.com",
    },
  });

  if (!adminExists) {
    // Create default admin user
    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    await prisma.user.create({
      data: {
        email: "wabelwilson@gmail.com",
        firstName: "Abel",
        lastName: "Walekhwa",
        phone: "+256752206865",
        password: hashedPassword,
        role: "ADMIN",
        progressStatus: "COMPLETED", // Admin doesn't need to go through the progress steps
      },
    });

    console.log("Default admin user created");
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
