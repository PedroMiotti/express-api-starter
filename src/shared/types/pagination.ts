export type BasePaginationResult<T> = {
  results: T[];
  total: number;
  page: number;
  limit: number;
};

export type BasePaginationParams = {
  page?: number;
  limit?: number;
};

export type BasePaginationWithOffsetParams = {
  page: number;
  limit: number;
  offset: number;
};
