import type {
  BasePaginationParams,
  BasePaginationWithOffsetParams,
} from '@/shared/types/pagination';

export const getPaginationParams = (
  params: BasePaginationParams,
): BasePaginationWithOffsetParams => {
  const page = params.page || 1;
  const limit = params.limit || 10;

  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
};
