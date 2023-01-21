import { PrismaClient } from "@prisma/client";
import { createPaginator } from "../utils/pagination";

const prisma = new PrismaClient();

async function main() {
  const paginatedResult = await createPaginator(prisma.post, {
    page: 1,
    perPage: 3,
  }).paginate({
    where: { authorId: 1 },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  console.log(paginatedResult);
}

main();
