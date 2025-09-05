import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@libs/dao/base/base.dto';
import { Currency } from '@libs/dao/game/user-details/type/currency';

export class CurrencyDto extends BaseDto<Currency> {
  @ApiProperty()
  gold: number;
}
