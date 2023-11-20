import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "example@example.com",
      injuryLists: {
        create: [
          {
            reporter: "example",
            date: "2001-01-01",
            injuries: {
              create: [
                {
                  area: "left leg",
                  description: "broken bone",
                },
                {
                  area: "left leg",
                  description: "Scar",
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`Created user with email: ${user.email}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
