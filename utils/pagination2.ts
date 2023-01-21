import { UnwrapPromise } from "@prisma/client";
import { omit } from "./omit";

type ModelDelegate = {
  findMany: (args: any) => any;
  count: (args: any) => Promise<number>;
};

// ここ、ライブラリ内部はanyになるのであんまり良くない
type PaginationOptions<Model extends ModelDelegate> = Parameters<
  Model["findMany"]
>[0] & {
  perPage: number;
  page: number;
};

type PaginationResult<Model extends ModelDelegate> = {
  items: UnwrapPromise<ReturnType<Model["findMany"]>>;
  count: number;
  pageCount: number;
};

// TODO: includeやselectを使ったときの戻り値の型
export async function paginate<Model extends ModelDelegate>(
  model: Model,
  options: PaginationOptions<Model>
): Promise<PaginationResult<Model>> {
  const [items, count] = await Promise.all([
    model.findMany({
      ...omit(options, "page", "perPage"),
      skip: options.perPage * (options.page - 1),
      take: options.perPage,
    }),
    model.count({ where: options.where }),
  ]);
  const pageCount = Math.ceil(count / options.perPage);

  return { items, count, pageCount };
}
