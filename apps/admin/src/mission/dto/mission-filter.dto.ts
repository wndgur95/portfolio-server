import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  NumberFilter,
  FilterDto,
  DateFilter,
} from '@libs/common/dto/pagination-in.dto';

export class MissionFilterDto extends FilterDto {
  @ApiPropertyOptional({ type: NumberFilter, description: '캐릭터 id 필터' })
  @ValidateNested()
  @Type(() => NumberFilter)
  dataMissionId?: NumberFilter;

  @ApiPropertyOptional({ type: NumberFilter, description: '클리어 필터' })
  @ValidateNested()
  @Type(() => NumberFilter)
  count?: NumberFilter;

  @ApiPropertyOptional({ type: DateFilter, description: '갯수 필터' })
  @ValidateNested()
  @Type(() => DateFilter)
  rewardAt?: DateFilter;
}
