export type Edge<T> = { cursor: string; node: T };

type PageInfo = { endCursor: string | null; hasNextPage: boolean };

export type PaginatedResult<T> = {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount: number;
};
