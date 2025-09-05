import { ApiProperty } from '@nestjs/swagger';
import { GoodsType } from '@libs/dao/static/common.constants';
import { BaseDto } from '@libs/dao/base/base.dto';

export class RewardDto extends BaseDto<RewardDto> {
  @ApiProperty()
  goodsType: GoodsType;

  @ApiProperty()
  dataId: number;

  @ApiProperty()
  quantity: number;
}
