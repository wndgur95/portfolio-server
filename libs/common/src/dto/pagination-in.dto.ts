import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsIn, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export type NumberFilterType = 'eq' | 'gte' | 'lte' | 'between';
export type StringFilterType = 'eq' | 'like' | 'between';
export type DateFilterType = 'eq' | 'gte' | 'lte' | 'between';
export type SelectedFilterType = 'eq' | 'in';

export class NumberFilter {
  @ApiPropertyOptional({ description: '숫자 필터 타입', enum: ['eq', 'gte', 'lte', 'between'], example: 'gte' })
  type: NumberFilterType;
  @ApiPropertyOptional({ description: '비교 값', example: 10 })
  value: number | number[];
}

export class StringFilter {
  @ApiPropertyOptional({ description: '문자열 필터 타입', enum: ['eq', 'like', 'between'], example: 'like' })
  type: StringFilterType;
  @ApiPropertyOptional({ description: '비교 값', example: 'test' })
  value: string | string[];
}

export class FilterDto {
  [key: string]: FilterValue | undefined;
}

export class DateFilter {
  @ApiPropertyOptional({ description: '날짜 필터 타입', enum: ['eq', 'gte', 'lte', 'between'], example: 'gte' })
  type: DateFilterType;
  @ApiPropertyOptional({ description: '비교 값', example: '2025-07-21 00:00:00' })
  value: string | string[];
}

export class SelectedFilter {
  @ApiPropertyOptional({ description: '날짜 필터 타입', enum: ['eq', 'in'], example: 'eq' })
  type: SelectedFilterType;
  @ApiPropertyOptional({ description: '비교 값', example: '' })
  value: string | string[] | number | number[];
}

export type FilterValue = NumberFilter | StringFilter | DateFilter | SelectedFilter;

export class PaginationInDto<T = Record<string, FilterValue>> {
  @ApiPropertyOptional({ description: '페이지 번호', example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: '페이지 크기', example: 20, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  size?: number = 20;

  @ApiPropertyOptional({ description: '정렬 순서', example: 'DESC', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: '필터 조건',
    example: {
      age: { type: 'gte', value: 20 },
      email: { type: 'like', value: '@gmail.com' }
    }
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  filter?: T;
}
