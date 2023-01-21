import { PrismaClient } from "@prisma/client";
import { paginate } from "../utils/pagination2";

const prisma = new PrismaClient();

async function main() {
  const { items, count, pageCount } = await paginate(prisma.post, {
    page: 1,
    perPage: 3,
    where: { authorId: 1 },
  });
  console.log({ items, count, pageCount });
}

main();
