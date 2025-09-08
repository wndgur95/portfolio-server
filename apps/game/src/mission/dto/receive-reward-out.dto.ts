import { ApiProperty } from '@nestjs/swagger';
import { GoodsOutDto } from '@libs/common/dto/goods-out.dto';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { MissionDto } from '@libs/dao/game/missions/dto/mission.dto';

export class ReceiveRewardOutDto extends BaseOutDto {
  @ApiProperty({ type: MissionDto, isArray: true })
  mission: MissionDto[];

  @ApiProperty({ type: GoodsOutDto })
  goods: GoodsOutDto;
}
