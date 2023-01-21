import { Prisma } from "@prisma/client";

type PaginationOptions = {
  page: number;
  perPage: number;
};

type PaginationResult<T, A> = {
  items: Prisma.Result<T, A, "findMany">;
  count: number;
  pageCount: number;
};

export function createPaginator<T>(model: T, options: PaginationOptions) {
  return {
    async paginate<A>(
      args: Prisma.Exact<A, Prisma.Args<T, "findMany">>
    ): Promise<PaginationResult<T, A>> {
      const [items, count] = await Promise.all([
        (model as any).findMany({
          ...(args as any),
          skip: options.perPage * (options.page - 1),
          take: options.perPage,
        }),
        (model as any).count({ where: (args as any).where }),
      ]);
      const pageCount = Math.ceil(count / options.perPage);

      return { items, count, pageCount };
    },
  };
}
