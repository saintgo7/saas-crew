import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Pagination options interface
 */
export interface PaginationOptions {
  cursor?: string;
  limit: number;
  orderBy: string;
  orderDir: 'asc' | 'desc';
}

/**
 * Paginate decorator for cursor-based pagination
 *
 * Usage:
 * @Get()
 * async findAll(@Paginate() pagination: PaginationOptions) {
 *   const { cursor, limit } = pagination;
 *   return this.service.findAll({ cursor, limit });
 * }
 *
 * Query params:
 * ?cursor=lastItemId&limit=20&orderBy=createdAt&orderDir=desc
 */
export const Paginate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationOptions => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    return {
      cursor: query.cursor,
      limit: parseInt(query.limit) || 20,
      orderBy: query.orderBy || 'createdAt',
      orderDir: query.orderDir === 'asc' ? 'asc' : 'desc',
    };
  },
);

/**
 * Helper function to build Prisma cursor pagination query
 *
 * Usage:
 * const query = buildCursorQuery(pagination, 'id');
 * return this.prisma.project.findMany(query);
 */
export function buildCursorQuery(
  pagination: PaginationOptions,
  cursorField: string = 'id',
) {
  const { cursor, limit, orderBy, orderDir } = pagination;

  return {
    take: limit + 1, // Fetch one extra to check if there are more items
    skip: cursor ? 1 : 0, // Skip the cursor item
    cursor: cursor ? { [cursorField]: cursor } : undefined,
    orderBy: { [orderBy as string]: orderDir } as Record<string, 'asc' | 'desc'>,
  };
}

/**
 * Helper function to format paginated response
 *
 * Usage:
 * const items = await this.prisma.project.findMany(query);
 * return formatPaginatedResponse(items, pagination.limit, 'id');
 */
export function formatPaginatedResponse<T extends Record<string, unknown>>(
  items: T[],
  limit: number,
  cursorField: keyof T = 'id' as keyof T,
) {
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, -1) : items;
  const nextCursor = hasMore && data.length > 0 ? data[data.length - 1][cursorField] : null;

  return {
    data,
    pagination: {
      nextCursor,
      hasMore,
      count: data.length,
    },
  };
}
