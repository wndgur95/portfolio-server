import { GoodsType } from '@libs/dao/static/common.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CostDto {
  @ApiProperty()
  goodsType: GoodsType;

  @ApiProperty()
  dataId: number;

  @ApiProperty()
  quantity: number;
}
