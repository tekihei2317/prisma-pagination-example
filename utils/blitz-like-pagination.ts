type PaginateInputs<Items> = {
  page: number;
  perPage: number;
  queryFn: (args: { skip: number; take: number }) => Promise<Items>;
  countFn: () => Promise<number>;
};

type PaginateOutputs<Items> = {
  items: Items;
  count: number;
  pageCount: number;
};

/**
 * ページネーションされたデータを取得する
 */
export async function paginate<Items>({
  page,
  perPage,
  countFn,
  queryFn,
}: PaginateInputs<Items>): Promise<PaginateOutputs<Items>> {
  const [items, count] = await Promise.all([
    queryFn({
      skip: perPage * (page - 1),
      take: perPage,
    }),
    countFn(),
  ]);

  return {
    items,
    count,
    pageCount: Math.ceil(count / perPage),
  };
}
