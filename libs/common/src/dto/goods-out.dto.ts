import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { CharacterDto } from '@libs/dao/game/characters/dto/character.dto';

export class OverTranscendedCharacterDto extends BaseOutDto {
  @ApiProperty()
  dataCharacterId: number;

  @ApiProperty()
  count: number;
}

export class GoodsOutDto extends BaseOutDto {
  @ApiPropertyOptional()
  gold?: number;

  @ApiPropertyOptional({
    type: CharacterDto,
    isArray: true,
  })
  characters?: CharacterDto[];
}
