import { BaseMongoLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-mongo-log.collection';
import { ApiProperty } from '@nestjs/swagger';
import { BattleInfoDto } from '@libs/dao/redis/solo-battle/dto/battle-info.dto';
import { GoodsOutDto } from '@libs/common/dto/goods-out.dto';

export class FinishBattleCollection extends BaseMongoLogCollection {
  @ApiProperty()
  battleInfo: BattleInfoDto;

  @ApiProperty()
  goods: GoodsOutDto;

  constructor(partial?: Partial<FinishBattleCollection>) {
    super(partial);
    Object.assign(this, partial);
  }
}
