import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "test@example.com",
      posts: {
        create: [
          { title: "Prismaでページネーションを実装する" },
          { title: "Node.jsのconnectをコードリーディングしてみる" },
          { title: "type-challengesのオンラインジャッジを作りました" },
          { title: "記事1" },
          { title: "記事2" },
          { title: "記事3" },
          { title: "記事4" },
          { title: "記事5" },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
