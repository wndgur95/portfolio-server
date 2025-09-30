import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NumberFilter, StringFilter, FilterDto, SelectedFilter } from '@libs/common/dto/pagination-in.dto';

export class UserFilterDto extends FilterDto {
  @ApiPropertyOptional({ type: StringFilter, description: '유저 nid 필터' })
  @ValidateNested()
  @Type(() => StringFilter)
  nid?: StringFilter;

  @ApiPropertyOptional({ type: NumberFilter, description: '유저 게임 DB ID(샤드 넘버) 필터' })
  @ValidateNested()
  @Type(() => NumberFilter)
  gameDbId?: NumberFilter;

  @ApiPropertyOptional({ type: StringFilter, description: '플랫폼 타입 필터' })
  @ValidateNested()
  @Type(() => StringFilter)
  platform?: StringFilter;

  @ApiPropertyOptional({ type: SelectedFilter, description: '권한 필터' })
  @ValidateNested()
  @Type(() => SelectedFilter)
  roles?: SelectedFilter;
}
