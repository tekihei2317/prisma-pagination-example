import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Omit {
  <T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2];
  };
}

const omit: Omit = (obj, ...keys) => {
  const ret = {} as {
    [K in keyof typeof obj]: typeof obj[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
};

type PaginationResult<T, A> = {
  items: Prisma.Result<T, A, "findMany">;
  count: number;
  pageCount: number;
};

export const xprisma = prisma.$extends({
  model: {
    user: {
      async signUp(email: string) {
        await prisma.user.create({ data: { email } });
      },
    },
    $allModels: {
      async paginate<T, A>(
        this: T,
        args: Prisma.Exact<A, Prisma.Args<T, "findMany">> & {
          page: number;
          perPage: number;
        }
      ): Promise<PaginationResult<T, A>> {
        const { page, perPage } = args;

        const [items, count] = await Promise.all([
          (this as any).findMany({
            ...omit(args, "page", "perPage"),
            skip: perPage * (page - 1),
            take: perPage,
          }),
          (this as any).count({ where: (args as any).where }),
        ]);
        const pageCount = Math.ceil(count / perPage);

        return { items, count, pageCount };
      },
    },
  },
});
