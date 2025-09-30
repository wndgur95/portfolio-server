import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class PaginationOutDto extends BaseOutDto {
  @ApiProperty({ description: '전체 개수', example: 100 })
  total: number;

  @ApiProperty({ description: '페이지 번호', example: 1 })
  page: number;

  @ApiProperty({ description: '페이지 크기', example: 20 })
  size: number;

  @ApiProperty({
    description: '정렬 순서',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  order: 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: '필터 정보', example: { email: 'test@example.com' } })
  filter?: Record<string, any>;
}
