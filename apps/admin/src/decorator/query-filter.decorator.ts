import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginationInDto } from '@libs/common/dto/pagination-in.dto';

export const QueryFilter = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.query;
    // eslint-disable-next-line prefer-const
    let { page, size, order, ...filters } = value;

    page = page || 1;
    size = size || 20;
    order = order || 'DESC';

    const filterObj: any = {};
    for (const key of Object.keys(filters)) {
      try {
        filterObj[key] = JSON.parse(filters[key]);
      } catch {
        // 무시
      }
    }

    return plainToInstance(PaginationInDto, {
      page,
      size,
      order,
      filter: filterObj,
    });
  },
);
