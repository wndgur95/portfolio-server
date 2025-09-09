import { ApiProperty } from '@nestjs/swagger';
import { GoodsOutDto } from '@libs/common/dto/goods-out.dto';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class GachaOutDto extends BaseOutDto {
  @ApiProperty({ type: GoodsOutDto })
  goods: GoodsOutDto;

  @ApiProperty()
  gachaCharacterIds: number[];
}
