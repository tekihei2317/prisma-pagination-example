import { xprisma } from "../prisma/client";

async function main() {
  const posts = await xprisma.post.paginate({
    where: { authorId: 1 },
    orderBy: { createdAt: "desc" },
    page: 1,
    perPage: 5,
  });

  // @ts-expect-error
  const users = await xprisma.user.paginate({
    page: 1,
    perPage: 5,
  });

  console.log({ posts, users });
}

main();
