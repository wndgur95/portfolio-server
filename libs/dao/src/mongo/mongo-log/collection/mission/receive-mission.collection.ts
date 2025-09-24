import { BaseMongoLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-mongo-log.collection';
import { ApiProperty } from '@nestjs/swagger';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';
import { GoodsOutDto } from '@libs/common/dto/goods-out.dto';

export class ReceiveMissionCollection extends BaseMongoLogCollection {
  @ApiProperty()
  mission: Mission;

  @ApiProperty()
  goods: GoodsOutDto;

  constructor(partial?: Partial<ReceiveMissionCollection>) {
    super(partial);
    Object.assign(this, partial);
  }
}
