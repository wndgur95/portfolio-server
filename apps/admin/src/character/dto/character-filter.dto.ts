import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NumberFilter, FilterDto } from '@libs/common/dto/pagination-in.dto';

export class CharacterFilterDto extends FilterDto {
  @ApiPropertyOptional({ type: NumberFilter, description: '캐릭터 id 필터' })
  @ValidateNested()
  @Type(() => NumberFilter)
  dataCharacterId?: NumberFilter;

  @ApiPropertyOptional({ type: NumberFilter, description: '레벨 필터' })
  @ValidateNested()
  @Type(() => NumberFilter)
  level?: NumberFilter;

  @ApiPropertyOptional({ type: NumberFilter, description: '갯수 필터' })
  @ValidateNested()
  @Type(() => NumberFilter)
  count?: NumberFilter;
}
