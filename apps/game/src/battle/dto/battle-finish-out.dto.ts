import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { GoodsOutDto } from '@libs/common/dto/goods-out.dto';

export class BattleFinishOutDto extends BaseOutDto {
  @ApiProperty({ type: GoodsOutDto })
  goods: GoodsOutDto;
}
