import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NumberFilter, FilterDto, DateFilter } from '@libs/common/dto/pagination-in.dto';

export class SoloBattleHistoryFilterDto extends FilterDto {
  @ApiPropertyOptional({ type: NumberFilter, description: '점수 필터' })
  @ValidateNested()
  @Type(() => NumberFilter)
  score?: NumberFilter;

  @ApiPropertyOptional({ type: NumberFilter, description: '선택 캐릭터 필터' })
  @ValidateNested()
  @Type(() => NumberFilter)
  dataCharacterId?: NumberFilter;

  @ApiPropertyOptional({ type: NumberFilter, description: '선택 캐릭터 레벨 필터' })
  @ValidateNested()
  @Type(() => NumberFilter)
  level?: NumberFilter;

  @ApiPropertyOptional({ type: DateFilter, description: '전투 시간 필터' })
  @ValidateNested()
  @Type(() => DateFilter)
  battleEndAt?: DateFilter;
}
