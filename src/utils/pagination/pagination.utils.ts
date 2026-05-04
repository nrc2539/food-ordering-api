import {
  Repository,
  SelectQueryBuilder,
  FindManyOptions,
  ObjectLiteral,
} from 'typeorm';

import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResult } from './pagination.interface';

// 1. For Simple Services (Repository)
export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  query: PaginationDto,
  options: FindManyOptions<T> = {},
): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 10, all = false } = query;

  const [data, total] = await repository.findAndCount({
    ...options,
    skip: all ? undefined : (page - 1) * limit,
    take: all ? undefined : limit,
  });

  return formatResponse(data, total, query);
}

// 2. For Complex Services (Query Builder)
export async function paginateQueryBuilder<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  query: PaginationDto,
): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 10, all = false } = query;

  if (!all) {
    queryBuilder.skip((page - 1) * limit).take(limit);
  }

  const [data, total] = await queryBuilder.getManyAndCount();
  return formatResponse(data, total, query);
}

// Internal Helper to keep it DRY
function formatResponse<T>(data: T[], total: number, query: PaginationDto) {
  const { page = 1, limit = 10, all = false } = query;
  return {
    data,
    meta: {
      totalItems: total,
      itemsPerPage: all ? total : limit,
      totalPages: all ? 1 : Math.ceil(total / limit),
      currentPage: all ? 1 : page,
    },
  };
}
