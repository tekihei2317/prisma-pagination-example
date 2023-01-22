import { Post, Prisma, PrismaClient } from "@prisma/client";
import { paginate } from "../utils/blitz-like-pagination";
import { createPaginator } from "prisma-pagination";
import * as prismaPaginate from "prisma-paginate";
import { xprisma } from "../prisma/client";

const prisma = new PrismaClient();

async function getPosts(input: { page: number }) {
  const perPage = 10;
  const skip = perPage * (input.page - 1);
  const where: Prisma.PostWhereInput = { authorId: 1 };

  const [posts, postCount] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.post.count({ where }),
  ]);
  const pageCount = Math.ceil(postCount / perPage);

  return { items: posts, count: postCount, pageCount };
}

async function getPostsV2(input: { page: number }) {
  const where: Prisma.PostWhereInput = { authorId: 1 };

  return await paginate({
    page: input.page,
    perPage: 10,
    queryFn: (args) =>
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        ...args,
      }),
    countFn: () => prisma.post.count({ where }),
  });
}

async function getPostsByPrismaPagination(input: { page: number }) {
  const paginate = createPaginator({ perPage: 10 });

  return await paginate<Post, Prisma.PostFindManyArgs>(
    prisma.post,
    {
      where: { authorId: 1 },
      orderBy: { createdAt: "desc" },
    },
    { page: input.page }
  );
}

async function getPostsByPrismaPaginate(input: { page: number }) {
  return await prismaPaginate(prisma.post)(
    {
      where: { authorId: 1 },
      orderBy: { createdAt: "desc" },
    },
    { page: input.page, limit: 10 }
  );
}

async function getPostsByClientExtension(input: { page: number }) {
  return await xprisma.post.paginate({
    page: 1,
    perPage: 10,
    where: { authorId: 1 },
    orderBy: { createdAt: "desc" },
  });
}

const input = { page: 1 };
console.log(
  Promise.all([
    getPosts(input),
    getPostsV2(input),
    getPostsByPrismaPagination(input),
    getPostsByPrismaPaginate(input),
    getPostsByClientExtension(input),
  ]).then(([v1, v2, prismaPagination, prismaPaginate, clientExtension]) =>
    console.log({ v1, v2, prismaPagination, prismaPaginate, clientExtension })
  )
);
