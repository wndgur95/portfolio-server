import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { CurrencyDto } from '@libs/dao/game/user-details/dto/currency.dto';
import { CharacterDto } from '@libs/dao/game/characters/dto/character.dto';

export class GoodsOutDto extends BaseOutDto {
  @ApiPropertyOptional({ type: CurrencyDto })
  currency?: CurrencyDto;

  @ApiPropertyOptional({
    type: CharacterDto,
    isArray: true,
  })
  characters?: CharacterDto[];
}
