import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const admins = ["emmillynamugaga@gmail.com", "wabelwilson@gmail.com"];

  for (const email of admins) {
    const adminExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!adminExists) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash("Admin@123", 12);

      await prisma.user.create({
        data: {
          email: email,
          firstName: email === "emmillynamugaga@gmail.com" ? "Emmilly" : "Abel",
          lastName: email === "emmillynamugaga@gmail.com" ? "Namugaga" : "Walekhwa",
          phone: email === "emmillynamugaga@gmail.com" ? "+256772024843 " : "+256752206865",
          password: hashedPassword,
          role: "ADMIN",
          progressStatus: "COMPLETED", // Admin doesn't need to go through the progress steps
        },
      });

      console.log(`Default admin user created for email: ${email}`);
    } else {
      console.log(`Admin user already exists for email: ${email}`);
    }
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